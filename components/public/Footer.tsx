export default function Footer() {
    return (
        <footer className="border-t bg-brand-surface dark:bg-dark-surface py-8">
            <div className="container mx-auto px-4 text-center text-brand-muted dark:text-dark-muted">
                <p>&copy; {new Date().getFullYear()} Cindy Lay. All rights reserved.</p>
            </div>
        </footer>
    )
}
