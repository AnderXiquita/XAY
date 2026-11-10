import Link from 'next/link'
import type { ProductStatus } from '@/lib/api'

export const STATUS_LABELS: Record<ProductStatus, string> = {
  draft: 'Borrador',
  available: 'Disponible',
  sold: 'Vendido',
  coming_soon: 'Próximamente',
}

const STATUS_COLORS: Record<ProductStatus, { bg: string; fg: string }> = {
  draft: { bg: 'var(--color-surface-alt)', fg: 'var(--color-text-secondary)' },
  available: { bg: 'var(--color-accent-subtle)', fg: 'var(--color-text-primary)' },
  sold: { bg: 'rgba(160, 57, 43, 0.1)', fg: 'var(--color-error)' },
  coming_soon: { bg: 'rgba(26, 77, 99, 0.12)', fg: 'var(--color-accent-light)' },
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  const color = STATUS_COLORS[status]
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap" style={{ backgroundColor: color.bg, color: color.fg }}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function FeaturedBadge() {
  return (
    <span
      title="Aparece en la página de inicio"
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap"
      style={{ backgroundColor: 'var(--color-text-primary)', color: 'var(--color-text-inverse)' }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6z" />
      </svg>
      Destacado
    </span>
  )
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          {title}
        </h1>
        {description && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="self-start sm:self-auto">{action}</div>}
    </div>
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
      {children}
    </div>
  )
}

export function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (page: number) => string }) {
  if (totalPages <= 1) return null
  const link = 'inline-flex items-center justify-center rounded-full border px-4 text-sm'
  const style = { minHeight: '40px', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }
  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      {page > 1 ? (
        <Link href={href(page - 1)} className={link} style={style}>
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={link} style={style}>
          Siguiente
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(160, 57, 43, 0.08)', color: 'var(--color-error)' }}>
      {message}
    </div>
  )
}
