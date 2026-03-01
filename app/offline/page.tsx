export default function OfflinePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-brand-primary">Offline</h1>
            <p className="text-brand-muted dark:text-dark-muted">
                Kamu sedang offline. Periksa koneksi internet kamu.
            </p>
        </div>
    )
}
