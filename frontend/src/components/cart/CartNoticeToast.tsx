'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'

// aviso arriba de la pantalla (debajo del header) para no chocar con la barra inferior ni el botón fijo del producto
export default function CartNoticeToast() {
  const { notice, dismissNotice } = useCart()

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-4 right-4 lg:left-auto lg:right-8 lg:w-[380px] z-[85] flex items-center gap-3 rounded-2xl px-5 py-4 shadow-lg"
      style={{
        top: '76px',
        backgroundColor: notice?.kind === 'error' ? 'var(--color-bg)' : 'var(--color-text-primary)',
        color: notice?.kind === 'error' ? 'var(--color-error)' : 'var(--color-text-inverse)',
        border: notice?.kind === 'error' ? '1px solid var(--color-error)' : 'none',
        opacity: notice ? 1 : 0,
        transform: notice ? 'translateY(0)' : 'translateY(-12px)',
        pointerEvents: notice ? 'auto' : 'none',
        transition: 'opacity 250ms ease, transform 250ms ease',
      }}
    >
      <p className="flex-1 text-sm leading-snug">{notice?.message}</p>
      {notice?.kind === 'added' && (
        <Link
          href="/carrito"
          onClick={dismissNotice}
          className="shrink-0 text-sm font-medium underline underline-offset-4 lg:hidden"
          style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
        >
          Ver carrito
        </Link>
      )}
      <button type="button" onClick={dismissNotice} aria-label="Cerrar aviso" className="shrink-0 flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
