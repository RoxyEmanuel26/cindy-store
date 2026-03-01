'use client'

import { useState, useEffect, useCallback } from 'react'

const WISHLIST_KEY = 'cindy-lay-wishlist'

export function useWishlist() {
    const [wishlistIds, setWishlistIds] = useState<string[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        try {
            const stored = localStorage.getItem(WISHLIST_KEY)
            if (stored) setWishlistIds(JSON.parse(stored))
        } catch {
            setWishlistIds([])
        }

        const handler = () => {
            try {
                const stored = localStorage.getItem(WISHLIST_KEY)
                setWishlistIds(stored ? JSON.parse(stored) : [])
            } catch { /* ignore */ }
        }
        window.addEventListener('wishlist-updated', handler)
        window.addEventListener('storage', handler)
        return () => {
            window.removeEventListener('wishlist-updated', handler)
            window.removeEventListener('storage', handler)
        }
    }, [])

    const saveToStorage = useCallback((ids: string[]) => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
        setWishlistIds(ids)
        window.dispatchEvent(new Event('wishlist-updated'))
    }, [])

    const addToWishlist = useCallback((productId: string) => {
        setWishlistIds((prev) => {
            if (prev.includes(productId)) return prev
            const next = [...prev, productId]
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
            window.dispatchEvent(new Event('wishlist-updated'))
            return next
        })
    }, [])

    const removeFromWishlist = useCallback((productId: string) => {
        setWishlistIds((prev) => {
            const next = prev.filter((id) => id !== productId)
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
            window.dispatchEvent(new Event('wishlist-updated'))
            return next
        })
    }, [])

    const toggleWishlist = useCallback((productId: string): boolean => {
        let added = false
        setWishlistIds((prev) => {
            if (prev.includes(productId)) {
                const next = prev.filter((id) => id !== productId)
                localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
                window.dispatchEvent(new Event('wishlist-updated'))
                added = false
                return next
            } else {
                const next = [...prev, productId]
                localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
                window.dispatchEvent(new Event('wishlist-updated'))
                added = true
                return next
            }
        })
        return added
    }, [])

    const isInWishlist = useCallback((productId: string) => {
        return wishlistIds.includes(productId)
    }, [wishlistIds])

    const clearWishlist = useCallback(() => {
        saveToStorage([])
    }, [saveToStorage])

    return {
        wishlistIds,
        wishlistCount: wishlistIds.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        mounted,
    }
}
