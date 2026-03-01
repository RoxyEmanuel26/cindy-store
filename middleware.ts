import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = requestCounts.get(ip)

    if (!entry || now > entry.resetAt) {
        requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
        return true
    }

    if (entry.count >= limit) return false
    entry.count++
    return true
}

// Cleanup stale entries every 5 mins
if (typeof globalThis !== 'undefined') {
    const cleanup = () => {
        const now = Date.now()
        for (const [key, value] of requestCounts.entries()) {
            if (now > value.resetAt) requestCounts.delete(key)
        }
    }
    // Use a global flag to avoid multiple intervals
    if (!(globalThis as any).__rateLimitCleanup) {
        (globalThis as any).__rateLimitCleanup = true
        setInterval(cleanup, 5 * 60 * 1000)
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1'

    // Rate limit: login (10 req/min)
    if (pathname === '/api/auth/signin' || pathname === '/api/auth/callback/credentials') {
        if (!checkRateLimit(`login:${ip}`, 10, 60 * 1000)) {
            return NextResponse.json(
                { error: 'Terlalu banyak percobaan. Tunggu 1 menit.', code: 'RATE_LIMITED' },
                { status: 429 }
            )
        }
    }

    // Rate limit: upload (20 req/min)
    if (pathname.startsWith('/api/upload')) {
        if (!checkRateLimit(`upload:${ip}`, 20, 60 * 1000)) {
            return NextResponse.json(
                { error: 'Terlalu banyak upload. Tunggu sebentar.' },
                { status: 429 }
            )
        }
    }

    // Rate limit: analytics (60 req/min)
    if (pathname.startsWith('/api/analytics')) {
        if (!checkRateLimit(`analytics:${ip}`, 60, 60 * 1000)) {
            return new NextResponse(null, { status: 429 })
        }
    }

    // Protect admin routes (except login page)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        try {
            const { auth } = await import('@/lib/auth')
            const session = await auth()

            if (!session) {
                const loginUrl = new URL('/admin/login', request.url)
                loginUrl.searchParams.set('callbackUrl', pathname)
                return NextResponse.redirect(loginUrl)
            }

            if ((session.user as any)?.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        } catch {
            const loginUrl = new URL('/admin/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // Redirect logged-in users away from login page
    if (pathname === '/admin/login') {
        try {
            const { auth } = await import('@/lib/auth')
            const session = await auth()
            if (session) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
        } catch { /* allow access */ }
    }

    // Protect /api/admin/* endpoints
    if (pathname.startsWith('/api/admin')) {
        try {
            const { auth } = await import('@/lib/auth')
            const session = await auth()
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        } catch {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/api/auth/:path*',
        '/api/upload/:path*',
        '/api/analytics/:path*',
    ],
}
