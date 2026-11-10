import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession, getToken } from '@/lib/session'
import { getAddresses } from '@/lib/api'
import { formatAddress } from '@/lib/format'
import { logoutAction } from '@/app/actions/auth'

export const metadata: Metadata = { title: 'Mi cuenta' }

function Card({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border p-6 transition-colors duration-300 hover:border-[var(--color-accent)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--color-accent)' }}>
          {title}
        </h2>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        {children}
      </div>
    </Link>
  )
}

const muted = { color: 'var(--color-text-muted)' }

export default async function AccountPage() {
  const user = await getSession()
  const token = await getToken()
  if (!user || !token) redirect('/ingresar?next=/cuenta')

  const addresses = await getAddresses(token)
  const list = addresses.ok ? addresses.data : []
  const main = list.find((a) => a.is_default) ?? list[0]
  const incomplete = !user.phone || list.length === 0

  return (
    <div className="space-y-5">
      {user.role === 'admin' && (
        <Link
          href="/admin"
          className="flex items-center justify-between gap-4 rounded-2xl p-6 transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-text-primary)', color: 'var(--color-text-inverse)' }}
        >
          <span>
            <span className="block text-xs uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255, 251, 244, 0.6)' }}>
              Administrador
            </span>
            <span className="block" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
              Panel de administración
            </span>
          </span>
          <span aria-hidden="true" className="text-xl">→</span>
        </Link>
      )}

      {incomplete && (
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-6"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Agrega tu teléfono y una dirección de entrega para que tu primer pedido sea más rápido.
          </p>
          <Link href="/bienvenida" className="btn-pill shrink-0">
            Completar perfil
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card href="/cuenta/datos" title="Mis datos">
          <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{user.name}</p>
          <p className="break-all">{user.email}</p>
          <p style={user.phone ? undefined : muted}>{user.phone ?? 'Sin teléfono'}</p>
        </Card>

        <Card href="/cuenta/direcciones" title="Mis direcciones">
          {main ? (
            <>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{main.label}</p>
              <p>{formatAddress(main)}</p>
              {list.length > 1 && <p style={muted}>y {list.length - 1} más</p>}
            </>
          ) : (
            <p style={muted}>Aún no tienes direcciones guardadas</p>
          )}
        </Card>

        <Card href="/cuenta/pedidos" title="Mis pedidos">
          <p style={muted}>Aún no tienes pedidos</p>
        </Card>

        <Card href="/cuenta/seguridad" title="Seguridad">
          <p style={muted}>Cambia tu contraseña</p>
        </Card>
      </div>

      <form action={logoutAction} className="lg:hidden pt-4">
        <button type="submit" className="btn-pill btn-pill-quiet w-full">
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
