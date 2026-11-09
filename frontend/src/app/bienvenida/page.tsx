import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import CompleteProfileForm from '@/components/account/CompleteProfileForm'
import { getSession } from '@/lib/session'
import { getDepartments } from '@/lib/api'
import { safeNext } from '@/lib/auth-cookie'

export const metadata: Metadata = { title: 'Completa tu perfil' }

export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next)
  const user = await getSession()
  if (!user) redirect(`/ingresar?next=${encodeURIComponent('/bienvenida')}`)

  const departments = await getDepartments()

  return (
    <AuthShell
      eyebrow="Tu cuenta está lista"
      title="Completa tu perfil"
      subtitle="Con estos datos tu primer pedido será más rápido. Si prefieres, puedes hacerlo después."
      image="/image/Departamentos.jpg"
    >
      <CompleteProfileForm
        departments={departments}
        next={next}
        defaults={{ phone: user.phone ?? '', birth_date: user.birth_date?.slice(0, 10) ?? '' }}
      />
    </AuthShell>
  )
}
