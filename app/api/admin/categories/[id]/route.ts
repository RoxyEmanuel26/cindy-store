import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CategorySchema } from '@/lib/validations'
import slugify from 'slugify'

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
    const validated = CategorySchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json(
            { error: validated.error.issues[0].message },
            { status: 400 }
        )
    }

    const { name } = validated.data
    const slug = slugify(name, { lower: true, locale: 'id', strict: true })

    // Cek duplikat (kecuali diri sendiri)
    const existing = await prisma.category.findFirst({
        where: {
            OR: [{ name }, { slug }],
            NOT: { id },
        },
    })

    if (existing) {
        return NextResponse.json(
            { error: 'Kategori dengan nama ini sudah ada' },
            { status: 409 }
        )
    }

    const category = await prisma.category.update({
        where: { id },
        data: { name, slug },
    })

    return NextResponse.json(category)
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

    // Cek apakah kategori masih punya produk
    const productCount = await prisma.product.count({
        where: { categoryId: id },
    })

    if (productCount > 0) {
        return NextResponse.json(
            { error: 'Hapus atau pindahkan semua produk di kategori ini terlebih dahulu' },
            { status: 400 }
        )
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ message: 'Kategori berhasil dihapus' })
}
