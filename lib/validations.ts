import { z } from 'zod'

export const LoginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const ProductSchema = z.object({
    title: z.string()
        .min(3, 'Judul minimal 3 karakter')
        .max(100, 'Judul maksimal 100 karakter'),
    slug: z.string().min(3),
    description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
    price: z.number().positive('Harga harus lebih dari 0'),
    image: z.string().url('URL foto tidak valid'),
    images: z.array(z.string().url()).max(4).optional(),
    shopeeUrl: z.string().url('Link Shopee tidak valid'),
    tokopediaUrl: z.string().url('Link Tokopedia tidak valid'),
    categoryId: z.string().min(1, 'Kategori wajib dipilih'),
    badge: z.enum(['NEW', 'HOT', 'BEST SELLER']).nullable().optional(),
    isActive: z.boolean().default(true),
})

export const CategorySchema = z.object({
    name: z.string()
        .min(2, 'Nama kategori minimal 2 karakter')
        .max(50, 'Nama kategori maksimal 50 karakter'),
    slug: z.string().min(2).optional(),
})

export const SettingsSchema = z.object({
    tagline: z.string().max(200).optional(),
    logo_url: z.string().url().optional().or(z.literal('')),
    hero_title: z.string().max(100).optional(),
    hero_subtitle: z.string().max(200).optional(),
    hero_image: z.string().url().optional().or(z.literal('')),
    about_text: z.string().optional(),
    wa_number: z.string()
        .regex(/^628\d{8,12}$/, 'Format nomor WA: 628xxxxxxxxxx')
        .optional(),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type ProductInput = z.infer<typeof ProductSchema>
export type CategoryInput = z.infer<typeof CategorySchema>
export type SettingsInput = z.infer<typeof SettingsSchema>
