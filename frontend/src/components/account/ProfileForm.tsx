'use client'

import { useActionState } from 'react'
import { updateProfileAction, type FormState } from '@/app/actions/account'
import type { User } from '@/lib/api'
import Field from '@/components/forms/Field'
import FormMessage from '@/components/forms/FormMessage'
import SubmitButton from '@/components/forms/SubmitButton'

export default function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState<FormState, FormData>(updateProfileAction, {})
  const error = (name: string) => state.fieldErrors?.[name]?.[0]
  const value = (name: 'name' | 'phone' | 'birth_date', fallback: string) => state.values?.[name] ?? fallback

  return (
    <form action={formAction} noValidate className="space-y-5 max-w-lg">
      <FormMessage error={state.error} success={state.success} />

      <Field label="Nombre completo" name="name" autoComplete="name" defaultValue={value('name', user.name)} error={error('name')} />

      <div>
        <p className="mb-1.5" style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          Correo electrónico
        </p>
        <p className="break-all" style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
          {user.email}
        </p>
      </div>

      <Field
        label="Teléfono"
        name="phone"
        type="tel"
        autoComplete="tel-national"
        placeholder="5555 1234"
        defaultValue={value('phone', user.phone ?? '')}
        error={error('phone')}
        hint="Para coordinar la entrega de tus pedidos"
      />

      <Field
        label="Fecha de nacimiento"
        name="birth_date"
        type="date"
        autoComplete="bday"
        optional
        max={new Date().toISOString().slice(0, 10)}
        defaultValue={value('birth_date', user.birth_date?.slice(0, 10) ?? '')}
        error={error('birth_date')}
        hint="Nos ayuda a recomendarte piezas"
      />

      <SubmitButton pendingText="Guardando…" className="w-full sm:w-auto" >
        Guardar cambios
      </SubmitButton>
    </form>
  )
}
