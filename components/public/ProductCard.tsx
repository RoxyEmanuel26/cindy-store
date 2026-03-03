'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { WishlistButton } from './WishlistButton'
import type { ProductType } from '@/types'

interface ProductCardProps {
    product: ProductType
    priority?: boolean
}

const badgeStyles: Record<string, string> = {
    NEW: 'bg-blue-500 text-white',
    HOT: 'bg-red-500 text-white',
    'BEST SELLER': 'bg-amber-400 text-white',
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    return (
        <Link href={`/products/${product.slug}`} className="group block h-full">
            <motion.div
                whileHover={{ y: -3, boxShadow: '0 16px 32px rgba(255,107,157,0.18)' }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm flex flex-col h-full border border-brand-border/50 dark:border-dark-border cursor-pointer"
            >
                {/* ===== IMAGE ===== */}
                {/* Fixed height — NOT aspect-ratio, so all cards identical regardless of container width */}
                <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: '180px' }}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={priority}
                    />
                    {/* Subtle gradient overlay bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

                    {/* Badge */}
                    {product.badge && (
                        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${badgeStyles[product.badge] || 'bg-gray-500 text-white'}`}>
                            {product.badge}
                        </span>
                    )}

                    {/* Wishlist */}
                    <WishlistButton product={product} variant="card" />
                </div>

                {/* ===== CONTENT ===== */}
                <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 min-w-0">

                    {/* Category */}
                    <span className="text-[11px] text-brand-primary dark:text-dark-primary font-semibold uppercase tracking-wide truncate leading-none">
                        {product.category?.name}
                    </span>

                    {/* Title — strict 2-line clamp with hard height */}
                    <div className="mt-1.5 overflow-hidden" style={{ height: '2.625rem' }}>
                        <h3 className="font-semibold text-[13px] leading-[1.3125rem] text-brand-text dark:text-dark-text line-clamp-2">
                            {product.title}
                        </h3>
                    </div>

                    {/* Price */}
                    <p className="text-brand-primary dark:text-dark-primary font-bold text-[15px] mt-2 leading-none">
                        {formatRupiah(product.price)}
                    </p>

                    {/* View count */}
                    <p className="flex items-center gap-1 text-[11px] text-brand-muted dark:text-dark-muted mt-1.5">
                        <Eye className="w-3 h-3 flex-shrink-0" />
                        {product.viewCount ?? 0} dilihat
                    </p>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Button */}
                    <button className="mt-3 w-full h-8 rounded-xl bg-brand-primary hover:bg-brand-accent active:scale-95 text-white text-xs font-semibold transition-all duration-150">
                        Lihat Detail
                    </button>
                </div>
            </motion.div>
        </Link>
    )
}
