'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-semibold">Terjadi Kesalahan</h2>
            <p className="text-brand-muted dark:text-dark-muted">
                Maaf, terjadi kesalahan yang tidak terduga.
            </p>
            <button
                onClick={reset}
                className="rounded-lg bg-brand-primary px-6 py-2 text-white hover:bg-brand-accent transition-colors"
            >
                Coba Lagi
            </button>
        </div>
    )
}
