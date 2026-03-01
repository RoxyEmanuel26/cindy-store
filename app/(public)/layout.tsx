export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* Header will be added here */}
            <main className="min-h-screen">{children}</main>
            {/* Footer will be added here */}
        </>
    )
}
