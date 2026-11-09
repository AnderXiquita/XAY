import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import AuthForm from '@/components/auth/AuthForm'
import AuthBenefits from '@/components/auth/AuthBenefits'
import { getSession } from '@/lib/session'
import { safeNext } from '@/lib/auth-cookie'

export const metadata: Metadata = { title: 'Crear cuenta' }

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next)
  if (await getSession()) redirect(next)

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Es gratis y toma menos de un minuto." footer={<AuthBenefits />}>
      <AuthForm mode="register" next={next} />
    </AuthShell>
  )
}
