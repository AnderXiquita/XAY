import type { Metadata } from 'next'
import { SectionTitle } from '@/components/account/AccountNav'
import PasswordForm from '@/components/account/PasswordForm'

export const metadata: Metadata = { title: 'Seguridad' }

export default function SecurityPage() {
  return (
    <>
      <SectionTitle title="Seguridad" description="Usa una contraseña que no uses en otros sitios." />
      <PasswordForm />
    </>
  )
}
