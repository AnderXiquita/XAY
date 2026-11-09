'use client'

import { useActionState } from 'react'
import { changePasswordAction, type FormState } from '@/app/actions/account'
import Field from '@/components/forms/Field'
import FormMessage from '@/components/forms/FormMessage'
import SubmitButton from '@/components/forms/SubmitButton'

export default function PasswordForm() {
  const [state, formAction] = useActionState<FormState, FormData>(changePasswordAction, {})
  const error = (name: string) => state.fieldErrors?.[name]?.[0]

  return (
    <form action={formAction} noValidate className="space-y-5 max-w-lg">
      <FormMessage error={state.error} success={state.success} />
      <Field label="Contraseña actual" name="current_password" type="password" autoComplete="current-password" error={error('current_password')} />
      <Field
        label="Nueva contraseña"
        name="new_password"
        type="password"
        autoComplete="new-password"
        error={error('new_password')}
        hint="Mínimo 8 caracteres"
      />
      <Field label="Repite la nueva contraseña" name="confirm_password" type="password" autoComplete="new-password" error={error('confirm_password')} />
      <SubmitButton pendingText="Guardando…" className="w-full sm:w-auto">
        Cambiar contraseña
      </SubmitButton>
    </form>
  )
}
