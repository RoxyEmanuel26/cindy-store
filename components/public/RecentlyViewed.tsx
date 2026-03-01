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
                    Terakhir Kamu Lihat 👁
                </h2>

                {loading ? (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-48">
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-brand-secondary">
                        {products.map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-48">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
