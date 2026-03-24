import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Marca */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              XAY
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Ropa típica guatemalteca presentada con la elegancia que merece.
              Cada pieza cuenta una historia.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wide mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Tienda
            </h4>
            <nav className="flex flex-col gap-2">
              <FooterLink href="/tienda">Ver todo</FooterLink>
              <FooterLink href="/tienda?category=guipiles">Güipiles</FooterLink>
              <FooterLink href="/tienda?category=cortes">Cortes</FooterLink>
              <FooterLink href="/tienda?category=complementos-modernos">Complementos Modernos</FooterLink>
            </nav>
          </div>

          {/* Información */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wide mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Información
            </h4>
            <nav className="flex flex-col gap-2">
              <FooterLink href="/about">Sobre Nosotros</FooterLink>
              <FooterLink href="/cultura">Cultura</FooterLink>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wide mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Contacto
            </h4>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Guatemala, Guatemala
            </p>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div
          className="border-t mt-8 pt-8 text-center text-sm"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          © {new Date().getFullYear()} XAY. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div>
      <Link
        href={href}
        className="text-sm transition-colors inline animated-underline"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {children}
      </Link>
    </div>
  )
}
