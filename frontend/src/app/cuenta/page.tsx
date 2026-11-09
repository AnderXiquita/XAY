import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { logoutAction } from '@/app/actions/auth'

export const metadata: Metadata = { title: 'Mi cuenta' }

export default async function AccountPage() {
  const user = await getSession()
  if (!user) redirect('/ingresar?next=/cuenta')

  const firstName = user.name.split(' ')[0]
  const memberSince = new Date(user.created_at).toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })

  const rows = [
    { label: 'Nombre', value: user.name },
    { label: 'Correo', value: user.email },
    { label: 'Teléfono', value: user.phone ?? 'Sin agregar' },
    { label: 'Cliente desde', value: memberSince },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8" style={{ backgroundColor: 'var(--color-border)' }} />
        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
          Mi cuenta
        </span>
      </div>
      <h1
        className="mb-10"
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: 'var(--color-text-primary)' }}
      >
        Hola, {firstName}
      </h1>

      <section className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h2 className="uppercase mb-5" style={{ fontSize: '0.75rem', letterSpacing: '0.14em', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          Tus datos
        </h2>
        <dl className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col sm:flex-row sm:justify-between gap-1 py-3" style={{ borderColor: 'var(--color-border)' }}>
              <dt style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{row.label}</dt>
              <dd className="break-all sm:text-right" style={{ fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link href="/tienda" className="btn-pill flex-1">
          Ir a la tienda
        </Link>
        <form action={logoutAction} className="flex-1">
          <button type="submit" className="btn-pill btn-pill-quiet w-full">
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
