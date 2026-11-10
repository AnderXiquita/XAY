'use client'

import { useTransition } from 'react'
import { setUserActiveAction } from '@/app/actions/admin'
import { useConfirm } from '@/components/ui/ConfirmDialog'
import { useAdminToast } from './AdminToast'

export default function UserActiveToggle({ userId, name, isActive, isSelf }: { userId: string; name: string; isActive: boolean; isSelf: boolean }) {
  const [confirm, dialog] = useConfirm()
  const [pending, startTransition] = useTransition()
  const toast = useAdminToast()

  if (isSelf) {
    return (
      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Tú
      </span>
    )
  }

  async function handleClick() {
    const ok = await confirm(
      isActive
        ? { title: `¿Desactivar a ${name}?`, message: 'No podrá iniciar sesión. Sus pedidos y datos se conservan, y puedes reactivarla cuando quieras.', confirmLabel: 'Desactivar', danger: true }
        : { title: `¿Reactivar a ${name}?`, message: 'Podrá volver a iniciar sesión con su correo y contraseña.', confirmLabel: 'Reactivar' },
    )
    if (!ok) return
    startTransition(async () => {
      const result = await setUserActiveAction(userId, !isActive)
      if (result.error) toast('error', result.error)
      else toast('success', isActive ? `La cuenta de ${name} quedó desactivada` : `La cuenta de ${name} está activa otra vez`)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-sm animated-underline disabled:opacity-50"
        style={{ minHeight: '40px', color: isActive ? 'var(--color-error)' : 'var(--color-text-primary)' }}
      >
        {pending ? 'Guardando…' : isActive ? 'Desactivar' : 'Reactivar'}
      </button>
      {dialog}
    </>
  )
}
