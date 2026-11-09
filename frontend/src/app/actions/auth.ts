'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginRequest, registerRequest, type AuthResult } from '@/lib/api'
import { PROFILE_COOKIE, SESSION_COOKIE, SESSION_MAX_AGE, initialOf, safeNext } from '@/lib/auth-cookie'

export interface AuthFormState {
  error?: string
  fieldErrors?: Record<string, string[]>
  values?: { name?: string; email?: string }
}

function field(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

async function finish(result: AuthResult, next: string, values: AuthFormState['values']): Promise<AuthFormState> {
  if (!result.ok) {
    const { details, error } = result.error
    return details ? { fieldErrors: details, values } : { error, values }
  }

  const store = await cookies()
  const options = { secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: SESSION_MAX_AGE }
  store.set(SESSION_COOKIE, result.token, { ...options, httpOnly: true })
  store.set(PROFILE_COOKIE, initialOf(result.user.name), options)

  redirect(next)
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, 'email')
  const result = await loginRequest({ email, password: field(formData, 'password') })
  return finish(result, safeNext(formData.get('next')), { email })
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = field(formData, 'name')
  const email = field(formData, 'email')
  const result = await registerRequest({ name, email, password: field(formData, 'password') })
  const next = safeNext(formData.get('next'))
  const welcome = next === '/cuenta' ? '/bienvenida' : `/bienvenida?next=${encodeURIComponent(next)}`
  return finish(result, welcome, { name, email })
}

export async function logoutAction() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  store.delete(PROFILE_COOKIE)
  redirect('/')
}
