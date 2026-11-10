'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useCart } from './CartProvider'
import CartLineItem from './CartLineItem'
import CartSummary from './CartSummary'

type LenisWindow = Window & { __lenis?: { stop: () => void; start: () => void } }

// panel lateral del carrito, solo en desktop (en mobile el carrito es la página /carrito)
export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!drawerOpen) return
    const lenis = (window as LenisWindow).__lenis
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer()
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen, closeDrawer])

  return (
    <div className="hidden lg:block" aria-hidden={!drawerOpen}>
      <div
        onClick={closeDrawer}
        className="fixed inset-0 z-[80]"
        style={{
          backgroundColor: 'rgba(9, 31, 44, 0.35)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu carrito"
        className="fixed top-0 right-0 bottom-0 z-[90] flex flex-col"
        style={{
          width: 'min(440px, 100vw)',
          backgroundColor: 'var(--color-bg)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1)',
          visibility: drawerOpen ? 'visible' : 'hidden',
          transitionProperty: 'transform, visibility',
        }}
      >
        <header className="flex items-center justify-between px-6 border-b" style={{ height: '80px', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Tu carrito {cart.count > 0 && <span className="text-sm font-normal" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>({cart.count})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
            className="flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface)]"
            style={{ width: '44px', height: '44px', color: 'var(--color-text-primary)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Tu carrito está vacío.
            </p>
            <Link href="/tienda" className="btn-pill" onClick={closeDrawer}>
              Explorar la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 divide-y" style={{ borderColor: 'var(--color-border)' }} data-lenis-prevent>
              {cart.items.map((line) => (
                <CartLineItem key={line.product_id} line={line} onNavigate={closeDrawer} />
              ))}
            </div>
            <div className="px-6 py-6 border-t" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <CartSummary />
              <Link href="/carrito" onClick={closeDrawer} className="block text-center text-sm mt-4 animated-underline mx-auto w-fit" style={{ color: 'var(--color-text-secondary)' }}>
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
