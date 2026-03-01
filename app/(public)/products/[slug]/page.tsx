export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Detail Produk</h1>
            <p className="mt-2 text-brand-muted dark:text-dark-muted">
                Detail produk akan ditampilkan di sini.
            </p>
        </div>
    )
}
