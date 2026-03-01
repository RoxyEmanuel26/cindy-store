import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CategorySchema } from '@/lib/validations'
import slugify from 'slugify'

export async function GET() {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { products: true } },
        },
    })

    return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = CategorySchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json(
            { error: validated.error.issues[0].message },
            { status: 400 }
        )
    }

    const { name } = validated.data
    const slug = slugify(name, { lower: true, locale: 'id', strict: true })

    // Cek duplikat
    const existing = await prisma.category.findFirst({
        where: { OR: [{ name }, { slug }] },
    })

    if (existing) {
        return NextResponse.json(
            { error: 'Kategori dengan nama ini sudah ada' },
            { status: 409 }
        )
    }

    const category = await prisma.category.create({
        data: { name, slug },
    })

    return NextResponse.json(category, { status: 201 })
}
