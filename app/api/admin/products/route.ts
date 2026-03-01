import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductSchema } from '@/lib/validations'
import slugify from 'slugify'

export async function GET(request: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const isActive = searchParams.get('isActive')

    const where: Record<string, unknown> = {}

    if (search) {
        where.title = { contains: search, mode: 'insensitive' }
    }
    if (categoryId) {
        where.categoryId = categoryId
    }
    if (isActive !== null && isActive !== '') {
        where.isActive = isActive === 'true'
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.product.count({ where }),
    ])

    return NextResponse.json({
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    })
}

export async function POST(request: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = ProductSchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json(
            { error: validated.error.issues[0].message },
            { status: 400 }
        )
    }

    const data = validated.data

    // Generate slug dari title
    let slug = slugify(data.title, { lower: true, locale: 'id', strict: true })

    // Pastikan slug unik
    const existingSlug = await prisma.product.findUnique({
        where: { slug },
    })
    if (existingSlug) {
        slug = `${slug}-${Date.now()}`
    }

    const product = await prisma.product.create({
        data: {
            title: data.title,
            slug,
            description: data.description,
            price: data.price,
            image: data.image,
            images: data.images || [],
            shopeeUrl: data.shopeeUrl,
            tokopediaUrl: data.tokopediaUrl,
            categoryId: data.categoryId,
            badge: data.badge || null,
            isActive: data.isActive ?? true,
        },
        include: { category: true },
    })

    return NextResponse.json(product, { status: 201 })
}
