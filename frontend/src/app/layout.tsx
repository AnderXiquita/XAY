import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import SmoothScroll from '@/components/ui/SmoothScroll'
import './globals.css'

/* ============================================
   FUENTES — Se cargan una sola vez aquí y aplican a todo el sitio.
   Next.js las optimiza automáticamente (las descarga en build, no en runtime).
   ============================================ */

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

/* ============================================
   METADATA — Lo que aparece en la pestaña del navegador y en Google.
   ============================================ */

export const metadata: Metadata = {
  title: {
    default: 'XAY — Ropa Típica Guatemalteca',
    template: '%s | XAY',
  },
  description:
    'Tienda en línea de ropa típica guatemalteca. Güipiles, cortes, fajas y perrajes de los 22 departamentos de Guatemala.',
  icons: {
    icon: '/favicon.svg',
  },
}

/* ============================================
   ROOT LAYOUT — Envuelve TODAS las páginas del sitio.
   El Header y Footer se renderizan una sola vez y no cambian al navegar.
   Solo el contenido ({children}) cambia entre páginas.
   ============================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased min-h-screen flex flex-col`}
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
        }}
      >
        <SmoothScroll />
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}
