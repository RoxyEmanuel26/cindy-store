'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DarkModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Hindari hydration mismatch
    useEffect(() => setMounted(true), [])
    if (!mounted) return <div className="w-9 h-9" />

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
            className="rounded-full hover:bg-brand-surface dark:hover:bg-dark-surface transition-colors"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-brand-secondary" />
            ) : (
                <Moon className="h-5 w-5 text-brand-muted" />
            )}
        </Button>
    )
}

export default DarkModeToggle
