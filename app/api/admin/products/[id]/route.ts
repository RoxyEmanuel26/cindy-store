import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductSchema } from '@/lib/validations'
import slugify from 'slugify'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    })

    if (!product) {
        return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(product)
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Jika hanya toggle isActive
    if (Object.keys(body).length === 1 && 'isActive' in body) {
        const product = await prisma.product.update({
            where: { id },
            data: { isActive: body.isActive },
        })
        return NextResponse.json(product)
    }

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

    // Pastikan slug unik (kecuali diri sendiri)
    const existingSlug = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
    })
    if (existingSlug) {
        slug = `${slug}-${Date.now()}`
    }

    const product = await prisma.product.update({
        where: { id },
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

    return NextResponse.json(product)
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ message: 'Produk berhasil dihapus' })
}
