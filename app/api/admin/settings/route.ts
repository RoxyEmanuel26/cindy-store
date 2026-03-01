import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SettingsSchema } from '@/lib/validations'

export async function GET() {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.siteSettings.findMany()

    // Convert array of {key, value} ke object
    const settingsObj: Record<string, string> = {}
    for (const s of settings) {
        settingsObj[s.key] = s.value
    }

    return NextResponse.json(settingsObj)
}

export async function PUT(request: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = SettingsSchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json(
            { error: validated.error.issues[0].message },
            { status: 400 }
        )
    }

    const data = validated.data

    // Loop setiap key-value, upsert ke database
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            await prisma.siteSettings.upsert({
                where: { key },
                update: { value: value || '' },
                create: { key, value: value || '' },
            })
        }
    }

    // Return updated settings
    const settings = await prisma.siteSettings.findMany()
    const settingsObj: Record<string, string> = {}
    for (const s of settings) {
        settingsObj[s.key] = s.value
    }

    return NextResponse.json(settingsObj)
}
