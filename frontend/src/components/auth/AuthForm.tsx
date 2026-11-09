'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction, registerAction, type AuthFormState } from '@/app/actions/auth'
import Field from '@/components/forms/Field'
import FormMessage from '@/components/forms/FormMessage'

interface AuthFormProps {
  mode: 'login' | 'register'
  next: string
}

export default function AuthForm({ mode, next }: AuthFormProps) {
  const isLogin = mode === 'login'
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(isLogin ? loginAction : registerAction, {})
  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0]
  const nextQuery = next === '/cuenta' ? '' : `?next=${encodeURIComponent(next)}`

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <FormMessage error={state.error} />

      {!isLogin && (
        <Field label="Nombre" name="name" autoComplete="name" defaultValue={state.values?.name} error={fieldError('name')} />
      )}
      <Field
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={fieldError('email')}
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete={isLogin ? 'current-password' : 'new-password'}
        error={fieldError('password')}
        {...(!isLogin && { hint: 'Mínimo 8 caracteres' })}
      />

      <button
        type="submit"
        disabled={pending}
        className="btn-pill w-full"
        style={{ marginTop: '32px' }}
      >
        {pending ? (isLogin ? 'Ingresando…' : 'Creando cuenta…') : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
      </button>

      <p className="text-center pt-2" style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <Link
          href={`${isLogin ? '/registro' : '/ingresar'}${nextQuery}`}
          className="animated-underline"
          style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
        >
          {isLogin ? 'Crea una' : 'Inicia sesión'}
        </Link>
      </p>
    </form>
  )
}
