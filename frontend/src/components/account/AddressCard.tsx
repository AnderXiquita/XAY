'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useConfirm } from '@/components/ui/ConfirmDialog'
import { deleteAddressAction, setDefaultAddressAction } from '@/app/actions/account'
import type { Address } from '@/lib/api'
import { formatAddress } from '@/lib/format'

const actionStyle = { minHeight: '44px', fontSize: '0.85rem', color: 'var(--color-text-primary)' }

export default function AddressCard({ address }: { address: Address }) {
  const [confirm, confirmDialog] = useConfirm()
  const deleteForm = useRef<HTMLFormElement>(null)

  async function askDelete() {
    const ok = await confirm({
      title: '¿Eliminar esta dirección?',
      message: `"${address.label}" ya no aparecerá al hacer un pedido. Los pedidos anteriores no cambian.`,
      confirmLabel: 'Eliminar',
      danger: true,
    })
    if (ok) deleteForm.current?.requestSubmit()
  }

  return (
    <article className="rounded-2xl border p-6" style={{ borderColor: address.is_default ? 'var(--color-accent)' : 'var(--color-border)' }}>
      <div className="flex items-center gap-3 mb-3">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{address.label}</h3>
        {address.is_default && (
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-text-primary)' }}
          >
            Principal
          </span>
        )}
      </div>

      <div className="text-sm leading-relaxed space-y-0.5" style={{ color: 'var(--color-text-secondary)' }}>
        <p>
          {address.recipient_name} · {address.phone}
        </p>
        <p>{formatAddress(address)}</p>
        {address.reference && <p style={{ color: 'var(--color-text-muted)' }}>{address.reference}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 mt-4 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <Link href={`/cuenta/direcciones/${address.id}`} className="inline-flex items-center animated-underline" style={actionStyle}>
          Editar
        </Link>
        {!address.is_default && (
          <form action={setDefaultAddressAction}>
            <input type="hidden" name="id" value={address.id} />
            <button type="submit" className="animated-underline" style={actionStyle}>
              Hacer principal
            </button>
          </form>
        )}
        <form ref={deleteForm} action={deleteAddressAction}>
          <input type="hidden" name="id" value={address.id} />
          <button type="button" onClick={askDelete} style={{ ...actionStyle, color: 'var(--color-error)' }}>
            Eliminar
          </button>
        </form>
      </div>
      {confirmDialog}
    </article>
  )
}
