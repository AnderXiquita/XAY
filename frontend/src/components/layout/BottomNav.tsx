'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const diff = currentY - lastScrollY.current

        if (diff > 6) {
          setVisible(false)
        } else if (diff < -6) {
          setVisible(true)
        }

        lastScrollY.current = currentY
        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Publica el estado en <html data-bottom-nav="..."> para que otras barras fijas
  // (ej. el botón de "Agregar al carrito" del detalle) se muevan junto con esta (ver globals.css)
  useEffect(() => {
    document.documentElement.dataset.bottomNav = visible ? 'visible' : 'hidden'
  }, [visible])

  useEffect(() => () => {
    delete document.documentElement.dataset.bottomNav
  }, [])

  const isHome = pathname === '/'
  const isFavoritos = pathname === '/favoritos'
  const isCarrito = pathname === '/carrito'
  const isCuenta = pathname === '/cuenta'

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t"
      style={{
        backgroundColor: 'rgba(255, 251, 244, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex items-center justify-around h-16">
        <NavItem href="/" isActive={isHome} badge={undefined}>
          <HomeIcon active={isHome} />
        </NavItem>
        <NavItem href="/favoritos" isActive={isFavoritos} badge={0}>
          <HeartIcon active={isFavoritos} />
        </NavItem>
        <NavItem href="/carrito" isActive={isCarrito} badge={0}>
          <CartIcon active={isCarrito} />
        </NavItem>
        <NavItem href="/cuenta" isActive={isCuenta} badge={undefined}>
          <UserIcon active={isCuenta} />
        </NavItem>
      </div>
    </nav>
  )
}

function NavItem({
  href,
  isActive,
  badge,
  children,
}: {
  href: string
  isActive?: boolean
  badge?: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="relative flex items-center justify-center"
      style={{ minWidth: '64px', minHeight: '48px' }}
    >
      <div className="relative">
        {children}
        {badge !== undefined && badge > 0 && (
          <span
            className="absolute -top-1.5 -right-2.5 flex items-center justify-center rounded-full pointer-events-none"
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              fontWeight: 500,
            }}
          >
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
    </Link>
  )
}

/* Íconos — strokeWidth 2.2 cuando activo, 1.5 normal. Color más oscuro cuando activo. */

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
      strokeWidth={active ? 2.2 : 1.5}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
      strokeWidth={active ? 2.2 : 1.5}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
      strokeWidth={active ? 2.2 : 1.5}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
      strokeWidth={active ? 2.2 : 1.5}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
