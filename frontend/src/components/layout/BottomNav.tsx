'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center justify-around h-16">
        <BottomNavItem href="/" label="Inicio" isActive={pathname === '/'}>
          <HomeIcon />
        </BottomNavItem>
        <BottomNavItem href="/buscar" label="Buscar" isActive={pathname === '/buscar'}>
          <SearchIcon />
        </BottomNavItem>
        <BottomNavItem href="/carrito" label="Carrito" isActive={pathname === '/carrito'} badge={0}>
          <CartIcon />
        </BottomNavItem>
        <BottomNavItem href="/cuenta" label="Mi cuenta" isActive={pathname === '/cuenta'}>
          <UserIcon />
        </BottomNavItem>
      </div>
    </nav>
  )
}

function BottomNavItem({
  href,
  label,
  isActive,
  badge,
  children,
}: {
  href: string
  label: string
  isActive: boolean
  badge?: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center justify-center gap-1"
      style={{
        minWidth: '64px',
        minHeight: '48px',
        color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
        transition: 'color 200ms ease',
      }}
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
              fontWeight: 600,
            }}
          >
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span
        className="text-xs"
        style={{ fontFamily: 'var(--font-body)', fontSize: '10px' }}
      >
        {label}
      </span>
    </Link>
  )
}

/* Iconos SVG — 22px, strokeWidth 1.5 */

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
