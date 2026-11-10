'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logoutAction } from '@/app/actions/auth'
import { AdminToastProvider } from './AdminToast'

const NAV = [
  { href: '/admin', label: 'Resumen', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { href: '/admin/productos', label: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { href: '/admin/categorias', label: 'Categorías', icon: 'M4 6h16M4 12h16M4 18h10' },
  { href: '/admin/proveedores', label: 'Proveedores', icon: 'M3 7h13v10H3zM16 10h4l1 3v4h-5M7 20a2 2 0 100-4 2 2 0 000 4zm11 0a2 2 0 100-4 2 2 0 000 4z' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
]

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

function Sidebar({ userName, onNavigate }: { userName: string; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6" style={{ height: '72px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.2em', fontSize: '1.3rem' }}>XAY</span>
        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(255, 251, 244, 0.55)' }}>
          Panel
        </span>
      </div>

      <nav aria-label="Panel" className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className="flex items-center gap-3 rounded-lg px-3 transition-colors"
              style={{
                minHeight: '44px',
                fontSize: '0.92rem',
                backgroundColor: active ? 'rgba(255, 251, 244, 0.12)' : undefined,
                color: active ? 'var(--color-text-inverse)' : 'rgba(255, 251, 244, 0.7)',
              }}
            >
              <NavIcon d={item.icon} />
              {item.label}
            </Link>
          )
        })}
        <div className="flex items-center gap-3 rounded-lg px-3" style={{ minHeight: '44px', fontSize: '0.92rem', color: 'rgba(255, 251, 244, 0.35)' }}>
          <NavIcon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          Pedidos
          <span className="ml-auto text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5" style={{ backgroundColor: 'rgba(255, 251, 244, 0.1)' }}>
            Pronto
          </span>
        </div>
      </nav>

      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'rgba(255, 251, 244, 0.12)' }}>
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3" style={{ minHeight: '44px', fontSize: '0.88rem', color: 'rgba(255, 251, 244, 0.7)' }}>
          <NavIcon d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          Ver la tienda
        </Link>
        <p className="px-3 pt-3 text-xs truncate" style={{ color: 'rgba(255, 251, 244, 0.5)' }}>
          {userName}
        </p>
        <form action={logoutAction}>
          <button type="submit" className="w-full text-left rounded-lg px-3" style={{ minHeight: '40px', fontSize: '0.85rem', color: 'rgba(255, 251, 244, 0.7)' }}>
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminShell({ userName, children }: { userName: string; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const dark = { backgroundColor: 'var(--color-text-primary)', color: 'var(--color-text-inverse)' }

  return (
    <div className="min-h-screen lg:pl-[248px]" style={{ backgroundColor: 'var(--color-surface)' }}>
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[248px] z-30" style={dark}>
        <Sidebar userName={userName} />
      </aside>

      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4" style={{ ...dark, height: '60px' }}>
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú" className="flex items-center justify-center" style={{ width: '44px', height: '44px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.2em' }}>XAY · Panel</span>
        <span style={{ width: '44px' }} />
      </header>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0" onClick={() => setMenuOpen(false)} style={{ backgroundColor: 'rgba(9, 31, 44, 0.45)' }} />
          <aside className="absolute inset-y-0 left-0 w-[260px]" style={{ ...dark, animation: 'fadeIn 200ms ease' }}>
            <Sidebar userName={userName} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <AdminToastProvider>
        <div className="px-4 sm:px-8 lg:px-10 py-6 lg:py-10 max-w-6xl">{children}</div>
      </AdminToastProvider>
    </div>
  )
}
