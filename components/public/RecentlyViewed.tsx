'use client'

import { useState, useEffect } from 'react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import ProductCard from './ProductCard'
import SkeletonCard from './SkeletonCard'
import type { ProductType } from '@/types'

export function RecentlyViewed() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const { getIds } = useRecentlyViewed()

    useEffect(() => {
        const ids = getIds()
        if (ids.length === 0) {
            setLoading(false)
            return
        }

        fetch('/api/products/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        })
            .then((r) => r.json())
            .then((data: ProductType[]) => {
                const sorted = ids
                    .map((id) => data.find((p) => p.id === id))
                    .filter(Boolean) as ProductType[]
                setProducts(sorted)
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!loading && products.length === 0) return null

    return (
        <section className="py-12 bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-brand-text dark:text-dark-text mb-6">
                    Terakhir Kamu Lihat 👁️
                </h2>

                {/* Grid layout — sama persis dengan Produk Pilihan */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                        : products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}
