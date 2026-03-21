import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | XAY',
  description: 'Conoce la historia detrás de XAY — la primera tienda en línea de ropa típica guatemalteca presentada con el estándar que merece.',
}

export default function AboutPage() {
  return (
    <div>
      {/* ============================================
          HERO — Layout editorial split.
          Tipografía grande a la izquierda, imagen
          vertical a la derecha. No full-bleed como el home.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-28 lg:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Lado izquierdo — texto editorial */}
          <div className="lg:col-span-7 flex flex-col justify-end">
            <span
              className="block text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              Sobre nosotros
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Creemos que la ropa típica guatemalteca merece{' '}
              <span style={{ color: 'var(--color-accent)' }}>el mismo estándar</span>{' '}
              que cualquier marca de alta moda
            </h1>
            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              La primera tienda en línea que presenta güipiles, cortes y textiles artesanales con fotografía profesional, origen trazable y una experiencia de compra real.
            </p>
          </div>

          {/* Lado derecho — imagen vertical */}
          <div className="lg:col-span-5">
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '3 / 4' }}
            >
              <Image
                src="/image/Destacadas 4.jpg"
                alt="Güipil guatemalteco tejido a mano"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ORIGEN — La historia con layout imagen + texto.
          Asimétrico: imagen grande a la izquierda,
          texto narrativo a la derecha.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Imagen */}
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '4 / 5' }}
          >
            <Image
              src="/image/Guipiles.jpeg"
              alt="Güipiles guatemaltecos coloridos"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Texto */}
          <div>
            <span
              className="block text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              El origen
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Todo empezó con una frustración
            </h2>
            <div className="flex flex-col gap-6">
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              >
                Queríamos comprar un güipil. Algo auténtico, bien hecho, con historia. Pero buscar uno fue un caos: perfiles de Instagram sin orden, fotos borrosas sobre mesas, precios inconsistentes, y cero información sobre el origen o el tipo de bordado.
              </p>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              >
                Si cualquier marca de ropa moderna tiene una tienda en línea decente, ¿por qué la ropa típica guatemalteca no? Ese fue el punto de partida. No somos diseñadores de moda — somos dos guatemaltecos que vieron un problema real y decidieron resolverlo con tecnología, diseño y respeto por el trabajo artesanal.
              </p>
              {/* El nombre XAY — mención sutil, no protagonista */}
              <div
                className="mt-4 pt-6 flex items-center gap-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <span
                  className="text-3xl sm:text-4xl font-bold tracking-[0.15em]"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  XAY
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                >
                  Nuestro nombre nace de la unión de dos apellidos guatemaltecos: <strong style={{ color: 'var(--color-text-secondary)' }}>X</strong>iquita y <strong style={{ color: 'var(--color-text-secondary)' }}>A</strong>jqueja<strong style={{ color: 'var(--color-text-secondary)' }}>y</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          QUOTE — Frase editorial a pantalla completa
          con imagen de fondo sutil.
          ============================================ */}
      <section className="relative overflow-hidden" style={{ minHeight: '50vh' }}>
        <Image
          src="/image/Fajas.jpeg"
          alt="Detalle de textil guatemalteco tejido a mano"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(44, 24, 16, 0.75)' }}
        />
        <div className="relative z-10 flex items-center justify-center px-6 sm:px-10 lg:px-20 py-20 sm:py-28" style={{ minHeight: '50vh' }}>
          <blockquote className="max-w-4xl text-center">
            <div
              className="mb-8 mx-auto"
              style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-accent-light)' }}
            />
            <p
              className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-snug"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}
            >
              Si una prenda lleva semanas de trabajo artesanal, merece una{' '}
              <span style={{ color: 'var(--color-accent-light)' }}>vitrina digna</span>.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ============================================
          MISIÓN — Layout imagen + texto invertido.
          Imagen a la derecha, texto a la izquierda.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Texto */}
          <div className="lg:order-1">
            <span
              className="block text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              Nuestra misión
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Cerrar la brecha entre tradición y mundo digital
            </h2>
            <div className="flex flex-col gap-6">
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              >
                Guatemala tiene una de las tradiciones textiles más ricas del mundo. Pero si querías comprar un güipil auténtico, tu única opción era un puesto en el mercado o un perfil de Instagram sin orden ni garantía.
              </p>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              >
                Creamos XAY para que la ropa típica se presente como lo que realmente es: piezas de arte hechas a mano, con información completa del origen, proceso y materiales. Una experiencia de compra que respeta tanto al artesano como al comprador.
              </p>
            </div>
          </div>

          {/* Imagen */}
          <div className="lg:order-2">
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '4 / 5' }}
            >
              <Image
                src="/image/Perajes.jpg"
                alt="Perrajes guatemaltecos con colores vibrantes"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          VISIÓN — A dónde vamos.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-36">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="block text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              La visión
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Si funciona en Guatemala, puede funcionar{' '}
              <span style={{ color: 'var(--color-accent)' }}>en el mundo</span>
            </h2>
          </div>

          {/* Dos columnas de texto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Perú tiene sus textiles. México tiene sus huipiles. Bolivia tiene sus aguayos. Cada país tiene una tradición textil que merece una plataforma digna. XAY empieza en Guatemala, pero el modelo está pensado para ir más allá.
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Imaginá poder comprar un textil artesanal de cualquier país del mundo desde tu teléfono, con fotos profesionales, información del origen, y la certeza de que tu dinero llegó a quien lo tejió. Ese es el futuro que estamos construyendo.
            </p>
          </div>

          {/* Tres países como indicadores visuales */}
          <div
            className="mt-16 pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="text-center sm:text-left">
              <p
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                Guatemala
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Güipiles, cortes, fajas, perrajes — donde todo empieza
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}
              >
                México
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Huipiles, rebozos, bordados oaxaqueños — próximamente
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}
              >
                Perú
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Textiles andinos, mantas, tapices — próximamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA FINAL — Fondo oscuro, imagen sutil,
          invitación a explorar la tienda.
          ============================================ */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-36"
        style={{ backgroundColor: 'var(--color-text-primary)' }}
      >
        <Image
          src="/image/6.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: 0.08 }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}
          >
            La ropa típica no es del pasado.
            <span className="block mt-2" style={{ color: 'var(--color-accent-light)' }}>
              Es el presente, bien presentado.
            </span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            Cada pieza en nuestra tienda fue tejida a mano por artesanas guatemaltecas.
            Conocé su trabajo.
          </p>
          <Link
            href="/tienda"
            className="inline-block px-10 py-3.5 text-sm font-medium about-cta-button"
          >
            Explorar la tienda
          </Link>
        </div>
      </section>
    </div>
  )
}