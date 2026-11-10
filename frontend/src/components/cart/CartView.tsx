'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'
import CartLineItem from './CartLineItem'
import CartSummary from './CartSummary'

export default function CartView() {
  const { cart, ready } = useCart()
  const empty = ready && cart.items.length === 0

  return (
    <>
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-10 lg:px-[3%] pt-10 pb-7 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
            Tu pedido
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Carrito
        </h1>
        {ready && cart.count > 0 && (
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {cart.count === 1 ? '1 pieza' : `${cart.count} piezas`}
          </p>
        )}
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 lg:px-[3%] py-8 pb-16">
        {!ready ? (
          <div className="space-y-5 max-w-2xl">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="rounded-lg shrink-0" style={{ width: '88px', aspectRatio: '3 / 4', backgroundColor: 'var(--color-surface)' }} />
                <div className="flex-1 space-y-2 pt-2">
                  <div className="h-3 w-1/3 rounded" style={{ backgroundColor: 'var(--color-surface)' }} />
                  <div className="h-4 w-2/3 rounded" style={{ backgroundColor: 'var(--color-surface)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : empty ? (
          <div className="max-w-md mx-auto text-center py-12 sm:py-20">
            <span
              className="inline-flex items-center justify-center rounded-full mb-6"
              style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Tu carrito está vacío
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Cada pieza es única. Cuando encuentres la tuya, agrégala aquí.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tienda" className="btn-pill">
                Explorar la tienda
              </Link>
              <Link href="/favoritos" className="btn-pill btn-pill-quiet">
                Ver mis favoritos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-7 xl:col-span-8 divide-y border-y" style={{ borderColor: 'var(--color-border)' }}>
              {cart.items.map((line) => (
                <CartLineItem key={line.product_id} line={line} />
              ))}
            </div>
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-28 rounded-2xl p-6" style={{ backgroundColor: 'var(--color-surface)' }}>
                <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                  Resumen
                </h2>
                <CartSummary />
              </div>
              <Link href="/tienda" className="block text-center text-sm mt-5 animated-underline mx-auto w-fit" style={{ color: 'var(--color-text-secondary)' }}>
                Seguir comprando
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
