const benefits = [
  {
    label: 'Guarda tus favoritas',
    icon: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />,
  },
  {
    label: 'Sigue tus pedidos',
    icon: (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </>
    ),
  },
  {
    label: 'Compra más rápido',
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
]

export default function AuthBenefits() {
  return (
    <ul className="grid grid-cols-3 gap-3 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
      {benefits.map((b) => (
        <li key={b.label} className="flex flex-col items-center text-center gap-3">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: '44px', height: '44px', backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {b.icon}
            </svg>
          </span>
          <span className="text-xs leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
            {b.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
