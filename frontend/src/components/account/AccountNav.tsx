'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'

export const accountSections = [
  { href: '/cuenta/datos', label: 'Mis datos' },
  { href: '/cuenta/direcciones', label: 'Mis direcciones' },
  { href: '/cuenta/pedidos', label: 'Mis pedidos' },
  { href: '/cuenta/seguridad', label: 'Seguridad' },
]

export function AccountHeader({ firstName }: { firstName: string }) {
  const pathname = usePathname()
  const isHome = pathname === '/cuenta'

  return (
    <>
      {!isHome && (
        <Link
          href="/cuenta"
          className="lg:hidden inline-flex items-center gap-2 -ml-1 mb-6"
          style={{ minHeight: '44px', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Mi cuenta
        </Link>
      )}
      <div className={isHome ? '' : 'hidden lg:block'}>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>
            Mi cuenta
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight mb-10 lg:mb-14"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Hola, {firstName}
        </h1>
      </div>
    </>
  )
}

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <nav aria-label="Mi cuenta" className="flex flex-col gap-1">
      {[{ href: '/cuenta', label: 'Resumen' }, ...accountSections].map((item) => {
        const active = item.href === '/cuenta' ? pathname === '/cuenta' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className="flex items-center rounded-lg px-4 transition-colors duration-200 hover:bg-[var(--color-surface)]"
            style={{
              minHeight: '44px',
              fontSize: '0.92rem',
              fontWeight: active ? 500 : 400,
              color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              backgroundColor: active ? 'var(--color-surface)' : undefined,
            }}
          >
            {item.label}
          </Link>
        )
      })}
      <form action={logoutAction} className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          type="submit"
          className="w-full text-left rounded-lg px-4 transition-colors duration-200 hover:bg-[var(--color-surface)]"
          style={{ minHeight: '44px', fontSize: '0.92rem', color: 'var(--color-text-muted)' }}
        >
          Cerrar sesión
        </button>
      </form>
    </nav>
  )
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
        {title}
      </h2>
      {description && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      )}
    </div>
  )
}
