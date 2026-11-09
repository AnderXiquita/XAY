import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import AuthForm from '@/components/auth/AuthForm'
import { getSession } from '@/lib/session'
import { safeNext } from '@/lib/auth-cookie'

export const metadata: Metadata = { title: 'Iniciar sesión' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next)
  if (await getSession()) redirect(next)

  return (
    <AuthShell title="Inicia sesión" subtitle="Accede a tu cuenta para ver tus pedidos y guardar tus piezas favoritas.">
      <AuthForm mode="login" next={next} />
    </AuthShell>
  )
}
