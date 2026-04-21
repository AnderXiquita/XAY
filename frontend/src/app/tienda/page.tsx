'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import ProductCard from '@/components/store/ProductCard'
import { getProducts, getCategories, getDepartments, getMunicipalitiesByDepartment } from '@/lib/api'
import type { Product, Category, Department, Municipality, ProductFilters } from '@/lib/api'

/* ============================================
   TIPOS INTERNOS
   ============================================ */

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'featured'
type ViewMode = 'grid-4' | 'grid-3' | 'grid-2' | 'list'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Más recientes',
  price_asc: 'Precio: menor a mayor',
  price_desc: 'Precio: mayor a menor',
  featured: 'Destacados primero',
}

/* ============================================
   COMPONENTE PRINCIPAL
   ============================================ */

export default function TiendaPage() {
  // Datos de la API
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filtros activos
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  // UI
  const [filtersOpen, setFiltersOpen] = useState(false) // bottom sheet mobile

  // Lock scroll del body cuando el bottom sheet esté abierto
  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3')
  const [gridVisible, setGridVisible] = useState(true)
  const [grandTotal, setGrandTotal] = useState(0) // total sin filtros

  // Secciones colapsables del filtro
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [departmentOpen, setDepartmentOpen] = useState(true)
  const [municipalityOpen, setMunicipalityOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)

  // Dropdown custom de departamento
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false)
  const departmentDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(e.target as Node)) {
        setDepartmentDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  /* Carga municipios cuando cambia el departamento seleccionado */
  useEffect(() => {
    if (!selectedDepartment) {
      setMunicipalities([])
      setSelectedMunicipalities([])
      return
    }
    getMunicipalitiesByDepartment(selectedDepartment).then(setMunicipalities)
    setSelectedMunicipalities([])
    setMunicipalityOpen(true)
  }, [selectedDepartment])

  function changeView(newMode: ViewMode) {
    setGridVisible(false)
    setTimeout(() => {
      setViewMode(newMode)
      setGridVisible(true)
    }, 160)
  }

  /* Carga categorías y departamentos una sola vez al montar */
  useEffect(() => {
    Promise.all([getCategories(), getDepartments()]).then(([cats, depts]) => {
      setCategories(cats)
      setDepartments(depts)
    })
  }, [])

  /* Re-fetch de productos cada vez que cambia cualquier filtro */
  const fetchProducts = useCallback(async (resetPage = false) => {
    // Fade out — igual que changeView, espera a que termine antes de cambiar contenido
    setGridVisible(false)
    setLoading(true)

    const currentPage = resetPage ? 1 : page
    if (resetPage) setPage(1)

    const filters: ProductFilters = {
      sort,
      page: currentPage,
      limit: 12,
    }

    if (selectedCategories.length > 0) filters.category = selectedCategories.join(',')
    if (selectedDepartment) filters.department = selectedDepartment
    if (selectedMunicipalities.length > 0) filters.municipality = selectedMunicipalities.join(',')
    if (minPrice) filters.min_price = minPrice
    if (maxPrice) filters.max_price = maxPrice

    try {
      // El fetch y el timer de fade out corren en paralelo
      const [res] = await Promise.all([
        getProducts(filters),
        new Promise(resolve => setTimeout(resolve, 160)),
      ])
      setProducts(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
      // Guardar el total global solo cuando no hay filtros activos
      if (selectedCategories.length === 0 && !selectedDepartment && selectedMunicipalities.length === 0 && !minPrice && !maxPrice) {
        setGrandTotal(res.total)
      }
    } catch (err) {
      console.error('Error al cargar productos:', err)
    } finally {
      setLoading(false)
      setGridVisible(true)
    }
  }, [selectedCategories, selectedDepartment, selectedMunicipalities, minPrice, maxPrice, sort, page])

  /* Cuando cambian filtros (no la página), resetear a página 1 */
  useEffect(() => {
    fetchProducts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedDepartment, selectedMunicipalities, minPrice, maxPrice, sort])

  /* Cuando cambia la página (sin cambiar filtros) */
  useEffect(() => {
    if (page === 1) return // ya se cargó con el efecto de arriba
    fetchProducts(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedDepartment('')
    setSelectedMunicipalities([])
    setMinPrice('')
    setMaxPrice('')
    setSort('newest')
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedDepartment || selectedMunicipalities.length > 0 || minPrice || maxPrice

  /* ============================================
     PANEL DE FILTROS — reutilizado en sidebar (desktop) y bottom sheet (mobile)
     ============================================ */
  const FiltersPanel = () => (
    <div className="space-y-6">

      {/* ── CATEGORÍA ── */}
      <div>
        <button
          onClick={() => setCategoryOpen(o => !o)}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <h3 className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
            Categoría
          </h3>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1 }}>
            {categoryOpen ? '−' : '+'}
          </span>
        </button>
        {/* grid-template-rows 1fr→0fr: anima la altura real del contenido, sin pausa */}
        <div style={{
          display: 'grid',
          gridTemplateRows: categoryOpen ? '1fr' : '0fr',
          opacity: categoryOpen ? 1 : 0,
          marginTop: categoryOpen ? '1rem' : '0',
          transition: 'grid-template-rows 300ms ease, opacity 250ms ease, margin-top 300ms ease',
        }}>
          <div style={{ minHeight: 0, overflow: 'hidden' }}>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={cat.slug}
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => setSelectedCategories(prev =>
                      prev.includes(cat.slug) ? prev.filter(s => s !== cat.slug) : [...prev, cat.slug]
                    )}
                    className="accent-[#091F2C]"
                    style={{ width: '15px', height: '15px' }}
                  />
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

      {/* ── DEPARTAMENTO + MUNICIPIO (anidado para evitar gap de space-y-6) ── */}
      <div>
        {/* Toggle departamento */}
        <button
          onClick={() => setDepartmentOpen(o => !o)}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <h3 className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
            Departamento
          </h3>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1 }}>
            {departmentOpen ? '−' : '+'}
          </span>
        </button>
        {/* El dropdown flotante necesita overflow:visible, por eso se usa max-height ajustado
            (52px = altura del botón trigger) en lugar del truco de grid */}
        <div style={{
          maxHeight: departmentOpen ? '52px' : '0px',
          opacity: departmentOpen ? 1 : 0,
          overflow: departmentOpen ? 'visible' : 'hidden',
          marginTop: departmentOpen ? '1rem' : '0',
          transition: 'max-height 250ms ease, opacity 250ms ease, margin-top 250ms ease',
        }}>
          <div ref={departmentDropdownRef} className="relative">
            <button
              onClick={() => setDepartmentDropdownOpen(o => !o)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg"
              style={{
                fontFamily: 'var(--font-body)',
                color: selectedDepartment ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span>{selectedDepartment ? departments.find(d => d.slug === selectedDepartment)?.name : 'Todos los departamentos'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'transform 250ms ease', transform: departmentDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className="absolute left-0 w-full z-30 py-1 overflow-y-auto scrollbar-thin-dropdown"
              onWheel={(e) => {
                const el = e.currentTarget
                const atTop = el.scrollTop === 0
                const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
                if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) e.preventDefault()
                e.stopPropagation()
              }}
              style={{
                top: 'calc(100% + 4px)',
                maxHeight: '220px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-bg)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                border: '1px solid var(--color-border)',
                opacity: departmentDropdownOpen ? 1 : 0,
                transform: departmentDropdownOpen ? 'translateY(0)' : 'translateY(-6px)',
                pointerEvents: departmentDropdownOpen ? 'auto' : 'none',
                transition: 'opacity 200ms ease, transform 200ms ease',
              }}
            >
              <button
                onClick={() => { setSelectedDepartment(''); setDepartmentDropdownOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm"
                style={{ fontFamily: 'var(--font-body)', color: !selectedDepartment ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: !selectedDepartment ? 500 : 400, backgroundColor: 'transparent' }}
                onMouseEnter={e => { if (selectedDepartment) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                Todos los departamentos
              </button>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => { setSelectedDepartment(dept.slug); setDepartmentDropdownOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm"
                  style={{ fontFamily: 'var(--font-body)', color: dept.slug === selectedDepartment ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: dept.slug === selectedDepartment ? 500 : 400, backgroundColor: 'transparent' }}
                  onMouseEnter={e => { if (dept.slug !== selectedDepartment) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MUNICIPIO — anidado en dept para no recibir gap de space-y-6 ── */}
        <div style={{
          display: 'grid',
          gridTemplateRows: selectedDepartment ? '1fr' : '0fr',
          opacity: selectedDepartment ? 1 : 0,
          transition: 'grid-template-rows 350ms ease, opacity 300ms ease',
        }}>
          <div style={{ minHeight: 0, overflow: 'hidden' }}>
            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '1.5rem 0' }} />
            <button
              onClick={() => setMunicipalityOpen(o => !o)}
              className="w-full flex items-center justify-between cursor-pointer"
            >
              <h3 className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                Municipio
              </h3>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1 }}>
                {municipalityOpen ? '−' : '+'}
              </span>
            </button>
            <div style={{
              display: 'grid',
              gridTemplateRows: municipalityOpen ? '1fr' : '0fr',
              opacity: municipalityOpen ? 1 : 0,
              marginTop: municipalityOpen ? '1rem' : '0',
              transition: 'grid-template-rows 300ms ease, opacity 250ms ease, margin-top 300ms ease',
            }}>
              <div style={{ minHeight: 0, overflow: 'hidden' }}>
                <div className="space-y-2 overflow-y-auto scrollbar-thin-dropdown" style={{ maxHeight: '260px' }}>
                  {municipalities.map((mun) => (
                    <label key={mun.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value={mun.slug}
                        checked={selectedMunicipalities.includes(mun.slug)}
                        onChange={() => setSelectedMunicipalities(prev =>
                          prev.includes(mun.slug) ? prev.filter(s => s !== mun.slug) : [...prev, mun.slug]
                        )}
                        className="accent-[#091F2C]"
                        style={{ width: '15px', height: '15px' }}
                      />
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {mun.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

      {/* ── PRECIO ── */}
      <div>
        <button
          onClick={() => setPriceOpen(o => !o)}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <h3 className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
            Precio (Q)
          </h3>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1 }}>
            {priceOpen ? '−' : '+'}
          </span>
        </button>
        <div style={{
          display: 'grid',
          gridTemplateRows: priceOpen ? '1fr' : '0fr',
          opacity: priceOpen ? 1 : 0,
          marginTop: priceOpen ? '1rem' : '0',
          transition: 'grid-template-rows 300ms ease, opacity 250ms ease, margin-top 300ms ease',
        }}>
          <div style={{ minHeight: 0, overflow: 'hidden' }}>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              />
              <span style={{ color: 'var(--color-text-muted)' }}>—</span>
              <input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── LIMPIAR FILTROS ── */}
      {hasActiveFilters && (
        <>
          <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm rounded-lg"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-accent)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 250ms ease, color 250ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = 'var(--color-accent)'
              el.style.color = 'var(--color-text-inverse)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = 'transparent'
              el.style.color = 'var(--color-accent)'
            }}
          >
            Limpiar filtros
          </button>
        </>
      )}
    </div>
  )

  /* ============================================
     RENDER
     ============================================ */
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* ── HEADER DE LA PÁGINA ── */}
      <section
        className="max-w-screen-2xl mx-auto px-4 sm:px-10 lg:px-[3%] pt-10 pb-7 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3">
          <a
            href="/"
            className="text-xs transition-colors duration-150"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            Inicio
          </a>
          <span style={{ color: 'var(--color-border)', fontSize: '0.75rem' }}>›</span>
          <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            Tienda
          </span>
          <div className="h-px flex-1 ml-2" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Productos
        </h1>
      </section>

      {/* ── LAYOUT PRINCIPAL: sidebar + grid ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 lg:px-[3%] py-8">

        {/* FILA SUPERIOR COMPARTIDA — Filtros label (desktop) + toolbar */}
        <div
          className="sticky top-16 z-20 lg:static -mx-4 sm:-mx-10 lg:mx-0 px-4 sm:px-10 lg:px-0 py-3 lg:py-0 mb-3 lg:mb-6 border-b lg:border-b-0 flex gap-10 items-center"
          style={{ backgroundColor: 'rgba(255, 251, 244, 0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderColor: 'var(--color-border)' }}
        >

          {/* Título Filtros — mismo ancho que el sidebar, solo desktop */}
          <div className="hidden lg:flex items-center gap-2 shrink-0" style={{ width: '220px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <h2
              className="text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
            >
              Filtros
            </h2>
          </div>

          {/* Toolbar: botón filtros mobile + contador + view + sort */}
          <div className="flex-1 flex items-center justify-between gap-4">

            {/* Botón "Filtrar" — solo mobile */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors duration-150"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Filtrar
              {hasActiveFilters && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              )}
            </button>

            {/* Contador — izquierda en desktop */}
            {!loading && (
              <p className="hidden lg:block text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                {hasActiveFilters
                  ? `${total} de ${grandTotal} ${grandTotal === 1 ? 'producto' : 'productos'}`
                  : `${grandTotal} ${grandTotal === 1 ? 'producto en total' : 'productos en total'}`
                }
              </p>
            )}

            {/* View toggle + sort — derecha */}
            <div className="flex items-center gap-4 ml-auto">
              <ViewToggle value={viewMode} onChange={changeView} />
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>
        </div>

        <div className="flex gap-10">

          {/* SIDEBAR DE FILTROS — solo desktop */}
          <aside className="hidden lg:block shrink-0" style={{ width: '220px' }}>
            <div className="sticky top-24">
              {FiltersPanel()}
            </div>
          </aside>

          {/* ÁREA PRINCIPAL */}
          <div className="flex-1 min-w-0">

            {/* Grid / Lista de productos */}
            {loading ? (
              /* Skeletons mientras carga */
              <div
                className={viewMode === 'list' ? 'flex flex-col gap-4' : `grid gap-3 sm:gap-6 ${viewMode === 'grid-4' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : viewMode === 'grid-2' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}
                style={{ opacity: gridVisible ? 1 : 0, transition: 'opacity 160ms ease' }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse overflow-hidden"
                    style={{ backgroundColor: 'var(--color-surface)', borderRadius: '9px' }}
                  >
                    {viewMode === 'list'
                      ? <div className="flex gap-4 p-3"><div style={{ width: '120px', minWidth: '120px', aspectRatio: '3/4', backgroundColor: 'var(--color-border)', borderRadius: '7px' }} /><div className="flex-1 py-2 space-y-2"><div className="h-3 rounded w-1/3" style={{ backgroundColor: 'var(--color-border)' }} /><div className="h-4 rounded w-2/3" style={{ backgroundColor: 'var(--color-border)' }} /><div className="h-4 rounded w-1/4" style={{ backgroundColor: 'var(--color-border)' }} /></div></div>
                      : <><div style={{ aspectRatio: '3/4', backgroundColor: 'var(--color-border)' }} /><div className="p-3 space-y-2"><div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }} /><div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--color-border)' }} /><div className="h-4 rounded w-1/3" style={{ backgroundColor: 'var(--color-border)' }} /></div></>
                    }
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Estado vacío */
              <div className="py-24 text-center">
                <p
                  className="mb-2 text-lg"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  No se encontraron piezas
                </p>
                <p
                  className="text-sm mb-6"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
                >
                  Prueba ajustando los filtros
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 text-sm rounded-full transition-colors duration-150"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-accent)',
                      border: '1px solid var(--color-accent)',
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <div
                  className={viewMode === 'list' ? 'flex flex-col gap-4' : `grid gap-3 sm:gap-6 ${viewMode === 'grid-4' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : viewMode === 'grid-2' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}
                  style={{
                    opacity: gridVisible ? 1 : 0,
                    transition: 'opacity 160ms ease',
                  }}
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} listMode={viewMode === 'list'} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm rounded-lg disabled:opacity-40 transition-colors duration-150"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      Anterior
                    </button>
                    <span
                      className="px-4 py-2 text-sm"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
                    >
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-sm rounded-lg disabled:opacity-40 transition-colors duration-150"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SHEET DE FILTROS — solo mobile ── */}
      <div className="lg:hidden">
        {/* Overlay oscuro — siempre en DOM, fade in/out */}
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: 'rgba(44,24,16,0.4)',
            opacity: filtersOpen ? 1 : 0,
            pointerEvents: filtersOpen ? 'auto' : 'none',
            transition: 'opacity 300ms ease',
          }}
          onClick={() => setFiltersOpen(false)}
        />

        {/* Panel — siempre en DOM, slide up/down con translateY */}
        <div
          className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl flex flex-col"
          style={{
            backgroundColor: 'var(--color-bg)',
            maxHeight: '85vh',
            boxShadow: '0 -8px 32px rgba(9,31,44,0.15)',
            transform: filtersOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1)',
            pointerEvents: filtersOpen ? 'auto' : 'none',
          }}
        >
          {/* Handle visual + header — fijo dentro del panel */}
          <div className="shrink-0 pt-3 pb-4 px-6" style={{ backgroundColor: 'var(--color-bg)', borderRadius: '24px 24px 0 0' }}>
            <div
              className="w-10 h-1 rounded-full mx-auto mb-4"
              style={{ backgroundColor: 'var(--color-border)' }}
            />
            <div className="flex items-center justify-between">
              <h2
                className="text-base font-semibold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                Filtros
              </h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-2 rounded-full"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido scrollable */}
          <div
            className="overflow-y-auto px-6"
            style={{ paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}
          >
            {FiltersPanel()}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-8 w-full py-3 rounded-full text-sm font-medium transition-colors duration-150"
              style={{
                fontFamily: 'var(--font-body)',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-text-inverse)',
              }}
            >
              Ver {total} {total === 1 ? 'pieza' : 'piezas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const isGrid = value !== 'list'

  // Iconos — viewBox 18x18, fill para consistencia visual
  const Icon4 = <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="1" y="2" width="3" height="5" rx="0.6"/><rect x="5.5" y="2" width="3" height="5" rx="0.6"/><rect x="10" y="2" width="3" height="5" rx="0.6"/><rect x="14.5" y="2" width="3" height="5" rx="0.6"/><rect x="1" y="9" width="3" height="5" rx="0.6"/><rect x="5.5" y="9" width="3" height="5" rx="0.6"/><rect x="10" y="9" width="3" height="5" rx="0.6"/><rect x="14.5" y="9" width="3" height="5" rx="0.6"/></svg>
  const Icon3 = <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="1" y="2" width="4.5" height="6" rx="0.6"/><rect x="6.75" y="2" width="4.5" height="6" rx="0.6"/><rect x="12.5" y="2" width="4.5" height="6" rx="0.6"/><rect x="1" y="10" width="4.5" height="6" rx="0.6"/><rect x="6.75" y="10" width="4.5" height="6" rx="0.6"/><rect x="12.5" y="10" width="4.5" height="6" rx="0.6"/></svg>
  const Icon2 = <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="1" y="2" width="7" height="9" rx="0.6"/><rect x="10" y="2" width="7" height="9" rx="0.6"/><rect x="1" y="13" width="7" height="3" rx="0.6"/><rect x="10" y="13" width="7" height="3" rx="0.6"/></svg>
  const IconList = <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><circle cx="2.5" cy="4.5" r="1.5"/><rect x="5.5" y="3.5" width="11" height="2" rx="0.5"/><circle cx="2.5" cy="9" r="1.5"/><rect x="5.5" y="8" width="11" height="2" rx="0.5"/><circle cx="2.5" cy="13.5" r="1.5"/><rect x="5.5" y="12.5" width="11" height="2" rx="0.5"/></svg>

  function iconBtn(active: boolean, icon: React.ReactNode, label: string, onClick: () => void) {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        style={{
          color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          transition: 'color 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '30px', height: '30px',
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)' }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)' }}
      >
        {icon}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-0.5">
      {/* Mobile: 2 botones — cuadrícula (activo si no es lista) y lista */}
      <div className="flex items-center gap-0.5 lg:hidden">
        {iconBtn(isGrid, Icon3, 'Cuadrícula', () => { if (!isGrid) onChange('grid-3') })}
        {iconBtn(!isGrid, IconList, 'Lista', () => onChange('list'))}
      </div>
      {/* Desktop: 4 modos */}
      <div className="hidden lg:flex items-center gap-0.5">
        {iconBtn(value === 'grid-4', Icon4, '4 columnas', () => onChange('grid-4'))}
        {iconBtn(value === 'grid-3', Icon3, '3 columnas', () => onChange('grid-3'))}
        {iconBtn(value === 'grid-2', Icon2, '2 columnas', () => onChange('grid-2'))}
        {iconBtn(value === 'list', IconList, 'Lista', () => onChange('list'))}
      </div>
    </div>
  )
}

function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm min-w-0"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}
      >
        <span className="hidden sm:inline truncate">{SORT_LABELS[value]}</span>
        <span className="sm:hidden text-xs" style={{ color: 'var(--color-text-muted)' }}>Ordenar</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'transform 250ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className="absolute right-0 z-20 mt-2 py-1 overflow-hidden"
        style={{
          borderRadius: '5px',
          minWidth: '200px',
          backgroundColor: 'var(--color-bg)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 200ms ease, transform 200ms ease',
        }}
      >
          {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150"
              style={{
                fontFamily: 'var(--font-body)',
                color: key === value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: key === value ? 500 : 400,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => { if (key !== value) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            >
              {label}
            </button>
          ))}
        </div>
    </div>
  )
}
