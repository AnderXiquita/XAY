'use client'

import { formatPrice } from '@/lib/format'
import { useCart } from './CartProvider'

export default function CartSummary() {
  const { cart } = useCart()
  const hasIssues = cart.items.some((line) => line.issue)

  return (
    <div>
      <dl className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {formatPrice(cart.subtotal)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd style={{ color: 'var(--color-text-muted)' }}>Se calcula en el siguiente paso</dd>
        </div>
      </dl>

      {hasIssues && (
        <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--color-error)' }}>
          Algunas piezas ya no están disponibles y no se cuentan en el total. Quítalas para continuar.
        </p>
      )}

      {/* TODO: checkout (bloque 8) */}
      <button type="button" disabled className="btn-pill w-full mt-6" style={{ cursor: 'not-allowed' }}>
        Continuar con el pedido
      </button>
      <p className="text-xs text-center mt-3" style={{ color: 'var(--color-text-muted)' }}>
        Muy pronto podrás completar tu pedido desde aquí.
      </p>
    </div>
  )
}
