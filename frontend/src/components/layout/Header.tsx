'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
        setIsSubmenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  function closeAll() {
    setIsSubmenuOpen(false)
    // Pequeño delay para que el submenú se cierre primero visualmente
    setTimeout(() => setIsMenuOpen(false), 50)
  }

  function closeMenu() {
    setIsMenuOpen(false)
    // Dejar que la animación del menú principal termine antes de resetear submenú
    setTimeout(() => setIsSubmenuOpen(false), 300)
  }

  function closeSubmenu() {
    setIsSubmenuOpen(false)
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{
          backgroundColor: 'rgba(27, 43, 65, 0.97)',
          borderColor: 'rgba(251, 249, 228, 0.15)',
        }}
      >
        <div className="px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Mobile: hamburguesa a la izquierda — solo abre, no cambia a X */}
            <button
              className="lg:hidden p-2 cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menú"
              style={{ minWidth: '44px', minHeight: '44px', color: 'var(--color-text-inverse)' }}
            >
              <MenuIcon />
            </button>

            {/* Desktop: Logo a la izquierda */}
            <Link
              href="/"
              className="text-2xl font-bold hidden lg:block"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-inverse)',
                letterSpacing: '0.2em',
              }}
            >
              XAY
            </Link>

            {/* Navegación desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              <DropdownLink label="Tienda" isActive={pathname.startsWith('/tienda')} />
              <NavLink href="/cultura" isActive={pathname.startsWith('/cultura')}>Cultura</NavLink>
              <NavLink href="/about" isActive={pathname.startsWith('/about')}>Sobre Nosotros</NavLink>
            </nav>

            {/* Iconos desktop */}
            <div className="hidden lg:flex items-center gap-1">
              <div className="relative flex items-center">
                <div
                  className="flex items-center overflow-hidden transition-all"
                  style={{
                    width: isSearchOpen ? '240px' : '44px',
                    height: '44px',
                    borderRadius: '9999px',
                    border: isSearchOpen ? '1px solid rgba(255, 251, 244, 0.3)' : '1px solid transparent',
                    backgroundColor: 'transparent',
                    transitionDuration: '300ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <button
                    aria-label="Buscar"
                    className="flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    style={{ width: '44px', height: '44px', color: 'rgba(255, 251, 244, 0.7)' }}
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-inverse)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 251, 244, 0.7)')}
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
                      color: 'var(--color-text-inverse)',
                      fontFamily: 'var(--font-body)',
                      opacity: isSearchOpen ? 1 : 0,
                      transition: 'opacity 200ms ease',
                    }}
                    onBlur={() => setIsSearchOpen(false)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setIsSearchOpen(false) }}
                  />
                </div>
              </div>
              {/* Favoritos */}
              <div className="relative">
                <IconButton label="Favoritos">
                  <HeartIcon />
                </IconButton>
                <span
                  className="absolute flex items-center justify-center rounded-full pointer-events-none"
                  style={{
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-text-inverse)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    fontWeight: 500,
                  }}
                >
                  0
                </span>
              </div>
              <IconButton label="Mi cuenta">
                <UserIcon />
              </IconButton>
              {/* Carrito */}
              <div className="relative">
                <IconButton label="Carrito">
                  <CartIcon />
                </IconButton>
                <span
                  className="absolute flex items-center justify-center rounded-full pointer-events-none"
                  style={{
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-text-inverse)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    fontWeight: 500,
                  }}
                >
                  0
                </span>
              </div>
            </div>

            {/* Mobile: Logo a la derecha */}
            <Link
              href="/"
              className="text-xl font-bold lg:hidden"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-inverse)',
                letterSpacing: '0.2em',
              }}
            >
              XAY
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================
          MENÚ MOBILE — Panel principal (fullscreen)
          ============================================ */}
      <div
        className="lg:hidden fixed inset-0 z-[60] flex flex-col"
        style={{
          backgroundColor: 'var(--color-bg)',
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header del menú */}
        <div
          className="flex items-center justify-between px-6 border-b shrink-0"
          style={{ height: '64px', borderColor: 'var(--color-border)' }}
        >
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            Menú
          </span>
          <button
            className="p-2 cursor-pointer"
            onClick={closeMenu}
            aria-label="Cerrar menú"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Barra de búsqueda mobile */}
        <div className="px-6 pt-6 pb-2">
          <div
            className="flex items-center gap-3 px-4"
            style={{
              height: '48px',
              borderRadius: '9999px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar prendas..."
              className="flex-1 text-sm outline-none bg-transparent"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
        </div>

        {/* Links principales */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-3 pb-20">
          {/* Tienda — texto a la izquierda, flecha a la derecha */}
          <div
            className="flex items-center justify-between"
            style={{ minHeight: '52px' }}
          >
            <Link
              href="/tienda"
              onClick={closeAll}
              className="text-2xl font-medium"
              style={{
                fontFamily: 'var(--font-display)',
                color: pathname.startsWith('/tienda') ? 'var(--color-accent)' : 'var(--color-text-primary)',
              }}
            >
              Tienda
            </Link>
            <button
              className="p-3 cursor-pointer"
              onClick={() => setIsSubmenuOpen(true)}
              aria-label="Ver categorías de tienda"
              style={{
                minWidth: '44px',
                minHeight: '44px',
                color: 'var(--color-text-muted)',
              }}
            >
              <ChevronRightIcon />
            </button>
          </div>

          <Link
            href="/cultura"
            onClick={closeAll}
            className="text-2xl font-medium py-3"
            style={{
              fontFamily: 'var(--font-display)',
              color: pathname.startsWith('/cultura') ? 'var(--color-accent)' : 'var(--color-text-primary)',
              minHeight: '52px',
            }}
          >
            Cultura
          </Link>

          <Link
            href="/about"
            onClick={closeAll}
            className="text-2xl font-medium py-3"
            style={{
              fontFamily: 'var(--font-display)',
              color: pathname.startsWith('/about') ? 'var(--color-accent)' : 'var(--color-text-primary)',
              minHeight: '52px',
            }}
          >
            Sobre Nosotros
          </Link>
        </nav>
      </div>

      {/* ============================================
          SUBMENÚ MOBILE — Categorías de tienda
          Se desliza desde la derecha.
          ============================================ */}
      <div
        className="lg:hidden fixed inset-0 z-[70] flex flex-col"
        style={{
          backgroundColor: 'var(--color-bg)',
          transform: isSubmenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header del submenú — < a la izquierda, X a la derecha */}
        <div
          className="flex items-center justify-between px-6 border-b shrink-0"
          style={{ height: '64px', borderColor: 'var(--color-border)' }}
        >
          <button
            className="p-2 cursor-pointer"
            onClick={closeSubmenu}
            aria-label="Volver al menú"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              color: 'var(--color-text-muted)',
            }}
          >
            <ChevronLeftIcon />
          </button>
          <button
            className="p-2 cursor-pointer"
            onClick={closeAll}
            aria-label="Cerrar menú"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              color: 'var(--color-text-muted)',
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Categorías */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-1 pb-20">
          {/* Ropa Típica */}
          <span
            className="text-sm uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
          >
            Ropa Típica
          </span>
          <SubmenuLink href="/tienda?category=guipiles" onClick={closeAll}>
            Güipiles
          </SubmenuLink>
          <SubmenuLink href="/tienda?category=cortes" onClick={closeAll}>
            Cortes
          </SubmenuLink>
          <SubmenuLink href="/tienda?category=fajas" onClick={closeAll}>
            Fajas
          </SubmenuLink>
          <SubmenuLink href="/tienda?category=perrajes" onClick={closeAll}>
            Perrajes
          </SubmenuLink>

          <div className="my-5" style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

          <span
            className="text-sm uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
          >
            Complementos
          </span>
          <SubmenuLink href="/tienda?category=complementos-modernos" onClick={closeAll}>
            Complementos Modernos
          </SubmenuLink>
          <SubmenuLink href="/tienda?category=accesorios" onClick={closeAll}>
            Accesorios
          </SubmenuLink>

          <div className="my-5" style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

          <span
            className="text-sm uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
          >
            Explorar
          </span>
          <SubmenuLink href="/tienda" onClick={closeAll}>
            Ver todo
          </SubmenuLink>
          <SubmenuLink href="/tienda?is_featured=true" onClick={closeAll}>
            Destacados
          </SubmenuLink>
        </nav>
      </div>
    </>
  )
}

/* ============================================
   COMPONENTES INTERNOS
   ============================================ */

function SubmenuLink({
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
      className="text-lg font-light py-2"
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text-secondary)',
        minHeight: '44px',
      }}
    >
      {children}
    </Link>
  )
}

function DropdownLink({ label, isActive }: { label: string; isActive?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const baseColor = isActive ? 'var(--color-text-inverse)' : 'rgba(255, 251, 244, 0.7)'

  function handleMouseEnter() {
    timeoutRef.current = setTimeout(() => setIsOpen(true), 150)
  }

  function handleMouseLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200)
  }

  function handleClick() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(false)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/tienda"
        onClick={handleClick}
        className="flex items-center gap-1 text-base font-light transition-colors cursor-pointer"
        style={{
          color: baseColor,
          fontFamily: 'var(--font-body)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-inverse)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = baseColor)}
      >
        {label}
        <ChevronDownIcon />
      </Link>
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[200%]"
        style={{
          top: '100%',
          height: '80px',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />
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

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) {
  const baseColor = isActive ? 'var(--color-text-inverse)' : 'rgba(255, 251, 244, 0.7)'

  return (
    <Link
      href={href}
      className="text-base font-light transition-colors"
      style={{
        color: baseColor,
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-inverse)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = baseColor)}
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
      style={{ minWidth: '44px', minHeight: '44px', color: 'rgba(255, 251, 244, 0.7)' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-inverse)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 251, 244, 0.7)')}
    >
      {children}
    </button>
  )
}

/* ============================================
   ICONOS SVG
   ============================================ */

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
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

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
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
