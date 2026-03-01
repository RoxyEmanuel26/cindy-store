import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-6xl font-bold text-brand-primary">404</h1>
            <h2 className="text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
            <p className="text-brand-muted dark:text-dark-muted">
                Halaman yang kamu cari tidak ditemukan.
            </p>
            <Link
                href="/"
                className="rounded-lg bg-brand-primary px-6 py-2 text-white hover:bg-brand-accent transition-colors"
            >
                Kembali ke Beranda
            </Link>
        </div>
    )
}
