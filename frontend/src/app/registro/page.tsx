import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import AuthForm from '@/components/auth/AuthForm'
import { getSession } from '@/lib/session'
import { safeNext } from '@/lib/auth-cookie'

export const metadata: Metadata = { title: 'Crear cuenta' }

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next)
  if (await getSession()) redirect(next)

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Guarda tus piezas favoritas y sigue tus pedidos en un solo lugar.">
      <AuthForm mode="register" next={next} />
    </AuthShell>
  )
}
