import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

import { DEFAULT_DESCRIPTION, BASE_URL } from '@/lib/metadata'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF6B9D' },
    { media: '(prefers-color-scheme: dark)', color: '#1C0D18' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Cindy Lay - Aksesori Wanita Colorful',
    template: '%s - Cindy Lay',
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  keywords: [
    'aksesori wanita',
    'gantungan kunci',
    'beads bracelet',
    'beads hp',
    'aksesori handmade',
    'aksesori colorful',
    'cindy lay',
    'toko aksesori online',
  ],
  authors: [{ name: 'Cindy Lay' }],
  creator: 'Cindy Lay',
  publisher: 'Cindy Lay',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={poppins.variable} suppressHydrationWarning>
      <body className="font-sans bg-brand-bg dark:bg-dark-bg text-brand-text dark:text-dark-text antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              className: 'font-sans',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
