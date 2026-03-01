export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <span className="text-xl font-bold text-brand-primary">Cindy Lay</span>
                <nav>{/* Navigation will be added here */}</nav>
            </div>
        </header>
    )
}
