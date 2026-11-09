'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginRequest, registerRequest, type AuthResult } from '@/lib/api'
import { SESSION_COOKIE, SESSION_MAX_AGE, safeNext } from '@/lib/auth-cookie'

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

  ;(await cookies()).set(SESSION_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

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
  return finish(result, safeNext(formData.get('next')), { name, email })
}

export async function logoutAction() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/')
}
