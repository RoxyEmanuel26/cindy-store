import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Buat akun admin default
    const passwordHash = await bcrypt.hash('CindyLay@2026', 12)

    await prisma.admin.upsert({
        where: { email: 'admin@cindylay.com' },
        update: {},
        create: {
            email: 'admin@cindylay.com',
            passwordHash,
            name: 'Admin Cindy Lay',
            role: 'admin',
        },
    })

    // Buat SiteSettings default
    const defaultSettings = [
        { key: 'tagline', value: 'Aksesori Wanita Colorful & Lucu' },
        { key: 'logo_url', value: '' },
        { key: 'hero_title', value: 'Koleksi Aksesori Wanita Terbaik' },
        {
            key: 'hero_subtitle',
            value: 'Temukan gantungan kunci, beads bracelet, dan aksesori lucu lainnya'
        },
        { key: 'hero_image', value: '' },
        {
            key: 'about_text',
            value: 'Cindy Lay adalah toko aksesori wanita yang menyediakan produk handmade berkualitas.'
        },
        { key: 'wa_number', value: '6281234567890' },
    ]

    for (const setting of defaultSettings) {
        await prisma.siteSettings.upsert({
            where: { key: setting.key },
            update: {},
            create: setting,
        })
    }

    // Buat beberapa kategori contoh
    const categories = [
        { name: 'Gantungan Kunci', slug: 'gantungan-kunci' },
        { name: 'Beads Bracelet', slug: 'beads-bracelet' },
        { name: 'Beads HP', slug: 'beads-hp' },
        { name: 'Kalung', slug: 'kalung' },
        { name: 'Anting', slug: 'anting' },
    ]

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
    }

    console.log('✅ Seed berhasil!')
    console.log('📧 Email admin : admin@cindylay.com')
    console.log('🔑 Password    : CindyLay@2026')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
