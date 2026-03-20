'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Cuando se abre la búsqueda, enfocar el input automáticamente
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm border-b"
      style={{
        backgroundColor: 'rgba(250, 247, 242, 0.95)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo / Nombre de la marca */}
          <Link
            href="/"
            className="text-xl lg:text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            [NOMBRE DE LA MARCA]
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <DropdownLink label="Tienda" />
            <NavLink href="/cultura">Cultura Guatemala</NavLink>
            <NavLink href="/about">Sobre Nosotros</NavLink>
          </nav>

          {/* Iconos de acción (desktop) */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Búsqueda animada: icono se convierte en input */}
            <div className="relative flex items-center">
              <div
                className="flex items-center overflow-hidden transition-all"
                style={{
                  width: isSearchOpen ? '240px' : '44px',
                  height: '44px',
                  borderRadius: '9999px',
                  border: isSearchOpen ? '1px solid var(--color-border)' : '1px solid transparent',
                  backgroundColor: 'transparent',
                  transitionDuration: '300ms',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <button
                  aria-label="Buscar"
                  className="flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  style={{
                    width: '44px',
                    height: '44px',
                    color: 'var(--color-text-secondary)',
                  }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  <SearchIcon />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar..."
                  className="w-full h-full pr-3 text-sm outline-none"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    opacity: isSearchOpen ? 1 : 0,
                    transition: 'opacity 200ms ease',
                  }}
                  onBlur={() => setIsSearchOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsSearchOpen(false)
                  }}
                />
              </div>
            </div>

            <IconButton label="Mi cuenta">
              <UserIcon />
            </IconButton>
            <div className="relative">
              <IconButton label="Carrito">
                <CartIcon />
              </IconButton>
              <span
                className="absolute top-0 right-0 flex items-center justify-center text-xs font-semibold rounded-full pointer-events-none"
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-text-inverse)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                }}
              >
                0
              </span>
            </div>
          </div>

          {/* Botón hamburguesa (mobile) */}
          <button
            className="lg:hidden p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {isMenuOpen && (
        <div
          className="lg:hidden border-t"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
          }}
        >
          <nav className="flex flex-col px-4 py-4 gap-1">
            <MobileNavLink href="/tienda" onClick={() => setIsMenuOpen(false)}>
              Tienda
            </MobileNavLink>
            <MobileNavLink href="/tienda?is_traditional=true" onClick={() => setIsMenuOpen(false)}>
              Ropa Típica
            </MobileNavLink>
            <MobileNavLink href="/tienda?is_traditional=false" onClick={() => setIsMenuOpen(false)}>
              Complementos Modernos
            </MobileNavLink>
            <MobileNavLink href="/cultura" onClick={() => setIsMenuOpen(false)}>
              Cultura Guatemala
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>
              Sobre Nosotros
            </MobileNavLink>
            <div className="border-t my-2" style={{ borderColor: 'var(--color-border)' }} />
            <MobileNavLink href="/login" onClick={() => setIsMenuOpen(false)}>
              Iniciar sesión
            </MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ============================================
   COMPONENTES INTERNOS
   ============================================ */

function DropdownLink({ label }: { label: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMouseEnter() {
    // Delay de 150ms antes de mostrar — evita flashazos accidentales
    timeoutRef.current = setTimeout(() => setIsOpen(true), 150)
  }

  function handleMouseLeave() {
    // Cancelar el timeout de entrada si el mouse sale antes de los 150ms
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    // Pequeño delay antes de cerrar para que no desaparezca de golpe
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/tienda"
        className="flex items-center gap-1 text-base font-light transition-colors cursor-pointer animated-underline"
        style={{
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        {label}
        <ChevronDownIcon />
      </Link>

      {/* Puente invisible entre el botón y el dropdown para evitar parpadeo */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[200%]"
        style={{
          top: '100%',
          height: '80px',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Mega dropdown con animación de entrada: fade + slide down */}
      <div
        className="fixed left-0 w-full transition-all"
        style={{
          top: '80px',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
          transitionDuration: '250ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div
          className="border-t"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="max-w-7xl mx-auto px-10 py-10">
            <div className="grid grid-cols-3 gap-12">

              {/* Columna: Ropa Típica */}
              <div>
                <Link
                  href="/tienda?is_traditional=true"
                  className="block text-base font-semibold mb-4 pb-2 border-b"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  Ropa Típica
                </Link>
                <div className="flex flex-col gap-2">
                  <MegaDropdownItem href="/tienda?category=guipiles">Güipiles</MegaDropdownItem>
                  <MegaDropdownItem href="/tienda?category=cortes">Cortes</MegaDropdownItem>
                  <MegaDropdownItem href="/tienda?category=fajas">Fajas</MegaDropdownItem>
                  <MegaDropdownItem href="/tienda?category=perrajes">Perrajes</MegaDropdownItem>
                </div>
              </div>

              {/* Columna: Complementos Modernos */}
              <div>
                <Link
                  href="/tienda?is_traditional=false"
                  className="block text-base font-semibold mb-4 pb-2 border-b"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  Complementos Modernos
                </Link>
                <div className="flex flex-col gap-2">
                  <MegaDropdownItem href="/tienda?category=complementos-modernos">Ver complementos</MegaDropdownItem>
                  <MegaDropdownItem href="/tienda?category=accesorios">Accesorios</MegaDropdownItem>
                </div>
              </div>

              {/* Columna: Explorar */}
              <div>
                <span
                  className="block text-base font-semibold mb-4 pb-2 border-b"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  Explorar
                </span>
                <div className="flex flex-col gap-2">
                  <MegaDropdownItem href="/tienda">Ver todo</MegaDropdownItem>
                  <MegaDropdownItem href="/tienda?is_featured=true">Destacados</MegaDropdownItem>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MegaDropdownItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <Link
        href={href}
        className="text-base font-light animated-underline inline"
        style={{ color: 'var(--color-text-secondary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        {children}
      </Link>
    </div>
  )
}

{/* 4) NavLink con subrayado animado izquierda→derecha en hover */}
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-base font-light transition-colors animated-underline"
      style={{
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-3 px-3 rounded-lg text-base font-medium"
      style={{
        color: 'var(--color-text-primary)',
        minHeight: '44px',
      }}
    >
      {children}
    </Link>
  )
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      className="p-2 rounded-lg transition-colors cursor-pointer"
      style={{ minWidth: '44px', minHeight: '44px', color: 'var(--color-text-secondary)' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
    >
      {children}
    </button>
  )
}

/* ============================================
   ICONOS SVG — todos 22px y strokeWidth 1.5 para consistencia
   ============================================ */

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
