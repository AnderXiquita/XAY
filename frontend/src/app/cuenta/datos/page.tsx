import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { SectionTitle } from '@/components/account/AccountNav'
import ProfileForm from '@/components/account/ProfileForm'

export const metadata: Metadata = { title: 'Mis datos' }

export default async function ProfilePage() {
  const user = await getSession()
  if (!user) redirect('/ingresar?next=/cuenta/datos')

  return (
    <>
      <SectionTitle title="Mis datos" description="Así te identificamos en tus pedidos." />
      <ProfileForm user={user} />
    </>
  )
}
