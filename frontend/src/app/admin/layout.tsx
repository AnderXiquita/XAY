import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import AdminShell from '@/components/admin/AdminShell'

export const metadata: Metadata = {
  title: { default: 'Panel', template: '%s · Panel XAY' },
  robots: { index: false, follow: false },
}

// la protección real está en el backend (requireAdmin); aquí solo se evita mostrar el panel
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/ingresar?next=/admin')
  if (user.role !== 'admin') notFound()

  return <AdminShell userName={user.name}>{children}</AdminShell>
}
