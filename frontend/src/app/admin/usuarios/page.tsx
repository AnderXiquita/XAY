import { getAdminUsers } from '@/lib/api'
import { requireAdminToken } from '@/lib/admin'
import { getSession } from '@/lib/session'
import { Card, ErrorNote, PageHeader, Pagination } from '@/components/admin/AdminUI'
import UserActiveToggle from '@/components/admin/UserActiveToggle'

export const metadata = { title: 'Usuarios' }

const ROLE_LABELS = { customer: 'Cliente', admin: 'Admin', vendor: 'Vendedor' } as const

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

function joined(date: string) {
  return new Date(date).toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const [token, me] = await Promise.all([requireAdminToken(), getSession()])
  const result = await getAdminUsers(token, { search: params.search, page })

  const href = (n: number) => `/admin/usuarios?${new URLSearchParams({ ...(params.search && { search: params.search }), page: String(n) })}`

  return (
    <>
      <PageHeader title="Usuarios" description={result.ok ? `${result.data.total} cuentas registradas` : undefined} />

      <form action="/admin/usuarios" className="mb-5">
        <input
          type="search"
          name="search"
          defaultValue={params.search}
          placeholder="Buscar por nombre o correo"
          className="w-full sm:w-80 rounded-full border px-4 outline-none focus:border-[var(--color-accent)]"
          style={{ minHeight: '40px', fontSize: '16px', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
        />
      </form>

      {!result.ok ? (
        <ErrorNote message={result.error.error} />
      ) : (
        <>
          <div className="space-y-3">
            {result.data.data.map((u) => (
              <Card key={u.id} className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span
                      className="shrink-0 flex items-center justify-center rounded-full text-sm font-semibold"
                      style={{ width: '40px', height: '40px', backgroundColor: u.is_active ? 'var(--color-text-primary)' : 'var(--color-surface-alt)', color: 'var(--color-text-inverse)' }}
                    >
                      {u.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium truncate" style={{ color: u.is_active ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                        {u.name}
                        {u.role !== 'customer' && (
                          <span className="ml-2 align-middle text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5" style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-text-primary)' }}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        )}
                        {!u.is_active && <span className="ml-2 text-xs font-normal">(desactivada)</span>}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                        {u.email}
                        {u.phone && ` · ${u.phone}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-xs sm:justify-end" style={{ color: 'var(--color-text-muted)' }}>
                    <span>Desde {joined(u.created_at)}</span>
                    <span>{plural(u._count.orders, 'pedido', 'pedidos')}</span>
                    <span>{plural(u._count.addresses, 'dirección', 'direcciones')}</span>
                    <UserActiveToggle userId={u.id} name={u.name.split(' ')[0] ?? u.name} isActive={u.is_active} isSelf={u.id === me?.id} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={result.data.page} totalPages={result.data.totalPages} href={href} />
        </>
      )}
    </>
  )
}
