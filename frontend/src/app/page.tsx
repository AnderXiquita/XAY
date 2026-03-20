'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton'

/* Lazy load del mapa — es un componente pesado (22 SVG paths grandes).
   Solo se carga cuando el usuario baja hasta esa sección. */
const GuatemalaMap = dynamic(() => import('@/components/home/GuatemalaMap'), {
  loading: () => (
    <div className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
      <div
        className="w-full rounded-lg"
        style={{
          height: '400px',
          background: 'linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-alt) 50%, var(--color-surface) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }}
      />
    </div>
  ),
  ssr: false,
})

/* Productos de prueba — se reemplazarán por datos reales de la API */
const featuredProducts = [
  {
    id: 1,
    name: 'Güipil de Sololá',
    origin: 'Sololá, Sololá',
    price: 1850,
    image: '/image/Destacadas 1.jpg',
    slug: 'guipil-solola-flores',
    category: 'Güipiles',
  },
  {
    id: 2,
    name: 'Güipil de Patzún',
    origin: 'Patzún, Chimaltenango',
    price: 2200,
    image: '/image/Destacadas 2.jpg',
    slug: 'guipil-patzun-ceremonial',
    category: 'Güipiles',
  },
  {
    id: 3,
    name: 'Corte de Quetzaltenango',
    origin: 'Quetzaltenango',
    price: 950,
    image: '/image/Destacadas 3.jpg',
    slug: 'corte-quetzaltenango',
    category: 'Cortes',
  },
  {
    id: 4,
    name: 'Güipil de Nebaj',
    origin: 'Nebaj, Quiché',
    price: 1600,
    image: '/image/Destacadas 4.jpg',
    slug: 'guipil-nebaj-triangulos',
    category: 'Güipiles',
  },
]

/* Categorías con imágenes reales */
const categories = [
  { name: 'Güipiles', slug: 'guipiles', image: '/image/Guipiles.jpeg' },
  { name: 'Cortes', slug: 'cortes', image: '/image/Cortes.jpg' },
  { name: 'Fajas', slug: 'fajas', image: '/image/Fajas.jpeg' },
  { name: 'Souvenirs', slug: 'souvenirs', image: '/image/Souvenirs.jpeg' },
  { name: 'Complementos', slug: 'complementos-modernos', image: '/image/Complementos.jpeg' },
  { name: 'Perrajes', slug: 'perrajes', image: '/image/Perajes.jpg' },
]

const heroImages = [
  { src: '/image/1.jpg', alt: 'Ropa típica guatemalteca — güipiles coloridos tejidos a mano' },
  { src: '/image/6.jpg', alt: 'Textiles guatemaltecos tradicionales con patrones vibrantes' },
  { src: '/image/Perajes.jpg', alt: 'Artesanía textil guatemalteca — tejido a mano' },
]

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0)

  const goToImage = useCallback((index: number) => {
    setCurrentImage(index)
  }, [])

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* ============================================
          HERO — Carrusel de imágenes con transición suave.
          Las 3 imágenes se apilan con position absolute.
          Solo la activa tiene opacity 1, las demás 0.
          ============================================ */}
      <section className="relative overflow-hidden" style={{ minHeight: '70vh' }}>
        {/* Imágenes apiladas con fade */}
        {heroImages.map((img, index) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover"
            style={{
              opacity: currentImage === index ? 1 : 0,
              transition: 'opacity 800ms ease',
            }}
          />
        ))}

        {/* Overlay oscuro para legibilidad del texto */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(44, 24, 16, 0.45)' }}
        />

        {/* Contenido del hero */}
        <div className="relative z-10 flex items-end px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24" style={{ minHeight: '70vh' }}>
          <div className="max-w-2xl">
            <span
              className="block text-sm sm:text-base uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-text-inverse)', fontFamily: 'var(--font-body)' }}
            >
              Ropa guatemalteca
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-none mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}
            >
              Con la elegancia<br />que merece
            </h1>
            <Link
              href="/tienda"
              className="inline-block px-8 py-3 text-base font-medium"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text-inverse)',
                borderRadius: '9999px',
                border: '1.5px solid var(--color-text-inverse)',
                transition: 'background-color 300ms ease, border-color 300ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'var(--color-text-inverse)'
              }}
            >
              Explorar la tienda
            </Link>
          </div>

          {/* Indicadores (puntitos) */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                aria-label={`Ir a imagen ${index + 1}`}
                onClick={() => goToImage(index)}
                className="cursor-pointer"
                style={{
                  width: currentImage === index ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: currentImage === index
                    ? 'var(--color-text-inverse)'
                    : 'rgba(250, 247, 242, 0.45)',
                  border: 'none',
                  transition: 'all 400ms ease',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PRODUCTOS DESTACADOS — Cards estilo tienda.
          Imagen del producto arriba, info abajo (nombre, origen, precio).
          Grid de 4 columnas en desktop, 2 en mobile.
          Hover: zoom sutil en imagen + aparece botón "Ver producto".
          ============================================ */}
      <section className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        {/* Encabezado de sección */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span
              className="block text-sm uppercase tracking-widest mb-2"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              Selección curada
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Piezas destacadas
            </h2>
          </div>
          <Link
            href="/tienda"
            className="hidden sm:inline-block text-sm font-medium animated-underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Ver toda la colección
          </Link>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/tienda/${product.slug}`}
              className="group cursor-pointer"
            >
              {/* Contenedor de imagen */}
              <div
                className="relative overflow-hidden mb-4"
                style={{ borderRadius: 'var(--radius-md)', aspectRatio: '3 / 4' }}
              >
                <ImageWithSkeleton
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Overlay que aparece en hover con botón */}
                <div
                  className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background: 'linear-gradient(to top, rgba(44, 24, 16, 0.4) 0%, transparent 50%)',
                  }}
                >
                  <span
                    className="px-5 py-2 text-xs uppercase tracking-wider font-medium translate-y-3 group-hover:translate-y-0 transition-transform duration-400"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      color: 'var(--color-text-primary)',
                      borderRadius: '9999px',
                    }}
                  >
                    Ver producto
                  </span>
                </div>
              </div>

              {/* Info del producto — fuera de la imagen */}
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                >
                  {product.origin}
                </p>
                <h3
                  className="text-sm sm:text-base font-medium mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Q {product.price.toLocaleString()}.00
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Link mobile */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/tienda"
            className="text-sm font-medium animated-underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Ver toda la colección
          </Link>
        </div>
      </section>
      {/* ============================================
          EDITORIAL — Sección de texto sobre calidad y proceso.
          No habla de cultura/Guatemala (eso va en su sección propia),
          sino del producto: materiales, proceso artesanal, calidad.
          ============================================ */}
      <section className="px-4 sm:px-6 lg:px-10 py-20 sm:py-28 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Línea decorativa superior */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              Hecho a mano
            </span>
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Cada pieza cuenta con{' '}
            <span style={{ color: 'var(--color-accent)' }}>semanas de trabajo</span>
          </h2>

          <p
            className="text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Nuestras prendas no salen de una fábrica. Cada hilo es seleccionado,
            cada bordado es trazado a mano, y cada combinación de colores responde
            a una tradición que se ha perfeccionado durante generaciones.
          </p>

          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Trabajamos directamente con artesanas que dominan técnicas de tejido en telar
            de cintura y bordado a mano. Sin intermediarios, sin producción en masa.
            Cuando adquirís una pieza, estás llevando algo que no se puede replicar.
          </p>

          {/* Tres columnas de datos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mt-14">
            <div>
              <p
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
              >
                100%
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Materiales naturales — algodón, jaspe, seda vegetal
              </p>
            </div>
            <div>
              <p
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
              >
                2–8
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Semanas de trabajo artesanal por cada prenda
              </p>
            </div>
            <div>
              <p
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
              >
                Única
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Cada pieza es irrepetible — no existe otra igual
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CATEGORÍAS — Layout mosaico.
          Fila 1: 3 columnas (40% / 30% / 30%)
          Fila 2: 3 columnas (30% / 30% / 40%) — invertido
          Crea un ritmo visual asimétrico, no un grid uniforme.
          ============================================ */}
      <section className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span
              className="block text-sm uppercase tracking-widest mb-2"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              Explora
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Categorías
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Fila 1: 1 col hasta lg, 2 en lg+ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {categories.slice(0, 2).map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} heightDesktop="380px" />
            ))}
          </div>

          {/* Fila 2: 1 col hasta lg, 3 en lg+ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {categories.slice(2, 5).map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} heightDesktop="320px" />
            ))}
          </div>

          {/* Fila 3: siempre 1 columna */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <CategoryCard cat={categories[5]} heightDesktop="280px" />
          </div>
        </div>
      </section>

      {/* ============================================
          MAPA DE GUATEMALA — Exploración por departamento.
          Mapa SVG interactivo con los 22 departamentos.
          Hover muestra info del departamento en panel lateral.
          ============================================ */}
      <GuatemalaMap />

      {/* ============================================
          HISTORIA DE LA MARCA — Sección emocional/confianza.
          Cuenta el porqué de la tienda, la conexión con las artesanas,
          y la visión de llevar la ropa típica al mundo.
          Sin imágenes por ahora — diseño tipográfico + layout asimétrico.
          ============================================ */}
      <section className="px-4 sm:px-6 lg:px-10 py-20 sm:py-28 lg:py-32">
        {/* Contenedor principal con borde sutil */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          {/* Elemento decorativo — comillas grandes */}
          <div
            className="absolute top-6 right-8 sm:top-8 sm:right-12 select-none pointer-events-none"
            style={{
              fontSize: 'clamp(120px, 20vw, 280px)',
              lineHeight: 1,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-border)',
            }}
          >
            &ldquo;
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 p-8 sm:p-12 lg:p-16">
            {/* Columna izquierda — título y frase principal */}
            <div className="flex flex-col justify-center">
              <span
                className="block text-sm uppercase tracking-widest mb-4"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
              >
                Nuestra historia
              </span>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                Nació de una pregunta simple:
                <span className="block mt-2" style={{ color: 'var(--color-accent)' }}>
                  ¿por qué no existe esto?
                </span>
              </h2>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              >
                Guatemala tiene una de las tradiciones textiles más ricas del mundo.
                Pero si querías comprar un güipil auténtico, tu única opción era un puesto
                en el mercado o un perfil de Instagram sin orden ni garantía. Eso tenía
                que cambiar.
              </p>
            </div>

            {/* Columna derecha — historia y valores */}
            <div className="flex flex-col gap-8">
              <div>
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  Creamos este espacio para que la ropa típica guatemalteca se presente
                  como lo que realmente es: piezas de arte hechas a mano, con semanas de
                  trabajo en cada una, con historia en cada hilo y tradición en cada color.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  Trabajamos directamente con artesanas de distintos departamentos del
                  país. Sin intermediarios. Cada prenda que ves aquí fue tejida a mano
                  por alguien que domina técnicas transmitidas por generaciones — y que
                  recibe un pago justo por su trabajo.
                </p>
              </div>

              {/* Tres pilares — con línea lateral de acento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div
                  className="pl-4"
                  style={{ borderLeft: '2px solid var(--color-accent-light)' }}
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
                  >
                    Comercio directo
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Sin intermediarios entre vos y la artesana que creó la pieza.
                  </p>
                </div>
                <div
                  className="pl-4"
                  style={{ borderLeft: '2px solid var(--color-accent-light)' }}
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
                  >
                    Piezas únicas
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Cada prenda es irrepetible. Si se vende, podés solicitar una similar.
                  </p>
                </div>
                <div
                  className="pl-4"
                  style={{ borderLeft: '2px solid var(--color-accent-light)' }}
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
                  >
                    Origen trazable
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Cada pieza muestra el departamento y municipio donde fue creada.
                  </p>
                </div>
              </div>

              {/* Link a la página completa */}
              <div>
                <Link
                  href="/nosotros"
                  className="inline-block px-6 py-2.5 text-sm font-medium"
                  style={{
                    color: 'var(--color-accent)',
                    borderRadius: '9999px',
                    border: '1.5px solid var(--color-accent)',
                    transition: 'background-color 300ms ease, color 300ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                    e.currentTarget.style.color = 'var(--color-text-inverse)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                >
                  Conocer más sobre nosotros
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function CategoryCard({ cat, heightDesktop }: { cat: { name: string; slug: string; image: string }; heightDesktop: string }) {
  return (
    <Link
      href={`/tienda?category=${cat.slug}`}
      className="group relative overflow-hidden cursor-pointer block"
      style={{ borderRadius: 'var(--radius-lg)' }}
    >
      {/* Contenedor con altura responsive usando min() y clamp() no funciona bien,
          así que usamos un div interno con media query via CSS variable */}
      <div
        className="relative w-full"
        style={{ minHeight: heightDesktop }}
      >
        <ImageWithSkeleton
          src={cat.image}
          alt={cat.name}
          fill
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ backgroundColor: 'rgba(44, 24, 16, 0.2)' }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundColor: 'rgba(44, 24, 16, 0.15)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="text-xl sm:text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}
          >
            {cat.name}
          </h3>
          <span
            className="inline-block text-xs uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400"
            style={{ color: 'var(--color-text-inverse)', fontFamily: 'var(--font-body)' }}
          >
            Explorar →
          </span>
        </div>
      </div>
    </Link>
  )
}
