import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Proteksi semua route /admin/* kecuali /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        try {
            // Dynamic import auth to handle missing config gracefully
            const { auth } = await import('@/lib/auth')
            const session = await auth()

            if (!session) {
                const loginUrl = new URL('/admin/login', request.url)
                loginUrl.searchParams.set('callbackUrl', pathname)
                return NextResponse.redirect(loginUrl)
            }
        } catch {
            // If auth is not configured yet, redirect to login
            const loginUrl = new URL('/admin/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // Jika sudah login dan akses /admin/login, redirect ke dashboard
    if (pathname === '/admin/login') {
        try {
            const { auth } = await import('@/lib/auth')
            const session = await auth()
            if (session) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
        } catch {
            // If auth is not configured, allow access to login page
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
