import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce la historia detrás de XAY — ropa típica guatemalteca con la elegancia que merece.',
}

export default function AboutPage() {
  return (
    <div>
      {/* ============================================
          HERO — El nombre XAY en tipografía gigante.
          Impacto visual inmediato, minimalista.
          ============================================ */}
      <section
        className="relative flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{ minHeight: '85vh' }}
      >
        {/* Nombre en letras enormes como fondo decorativo */}
        <div
          className="select-none pointer-events-none"
          style={{
            fontSize: 'clamp(150px, 30vw, 400px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: 'var(--color-border)',
            lineHeight: 0.85,
          }}
        >
          XAY
        </div>

        {/* Línea decorativa */}
        <div
          className="mt-8 mb-6"
          style={{ width: '60px', height: '2px', backgroundColor: 'var(--color-accent)' }}
        />

        {/* Subtítulo — origen del nombre */}
        <p
          className="text-center text-sm sm:text-base uppercase tracking-[0.3em]"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          Xiquita &amp; Ajquejay
        </p>

        {/* Frase principal */}
        <p
          className="text-center text-lg sm:text-xl max-w-lg mt-6 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          Dos apellidos guatemaltecos. Una misión compartida.
        </p>

        {/* Flecha scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animation: 'floatDown 2s ease-in-out infinite' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ============================================
          MANIFIESTO — Frase editorial grande.
          Tipografía serif gigante, centrada,
          con palabras clave en color accent.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-36">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight lg:leading-snug"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            Creemos que la{' '}
            <span style={{ color: 'var(--color-accent)' }}>ropa típica guatemalteca</span>{' '}
            merece ser presentada con el mismo estándar que cualquier marca de{' '}
            <span style={{ color: 'var(--color-accent)' }}>alta moda</span> internacional.
          </h2>
        </div>
      </section>

      {/* ============================================
          ORIGEN — La historia, cómo empezó todo.
          Layout asimétrico: etiqueta + texto grande a la izquierda,
          párrafos a la derecha.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Columna izquierda — número + título */}
          <div className="lg:col-span-5">
            <span
              className="block text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              El origen
            </span>
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Todo empezó con una frustración
            </h3>
          </div>

          {/* Columna derecha — historia */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Queríamos regalar un güipil. Algo auténtico, bien hecho, con historia.
              Pero buscar uno fue un caos: perfiles de Instagram sin orden, fotos borrosas
              sobre mesas, precios inconsistentes, y cero información sobre el origen
              o el tipo de bordado. Si cualquier marca de ropa moderna tiene una tienda
              en línea decente, ¿por qué la ropa típica guatemalteca no?
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Ese fue el punto de partida. No somos diseñadores de moda ni empresarios
              de la industria textil. Somos dos guatemaltecos que vieron un problema
              real y decidieron resolverlo con las herramientas que tienen: tecnología,
              diseño, y un respeto profundo por el trabajo artesanal.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          SEPARADOR — Frase en grande tipo quote.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="mb-6 mx-auto"
            style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-accent)' }}
          />
          <blockquote
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug italic"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            &ldquo;Si una prenda lleva semanas de trabajo, merece más que una foto
            de WhatsApp sobre una mesa.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ============================================
          MISIÓN — Qué hacemos y por qué importa.
          Layout inverso (texto izquierda, título derecha en desktop).
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Texto primero en mobile, segundo en desktop */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:order-1">
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              XAY existe para cerrar la brecha entre la ropa típica guatemalteca
              y el estándar visual que el mundo digital espera. Trabajamos directamente
              con artesanas de distintos departamentos del país — sin intermediarios,
              sin regateos, con pago justo.
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Cada pieza que aparece en la tienda fue fotografiada con cuidado,
              descrita con detalle, y etiquetada con su origen geográfico exacto:
              departamento y municipio. Porque saber de dónde viene una prenda
              es parte de su valor.
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              No producimos en masa. No tenemos fábricas. Lo que tenemos es una red
              de artesanas que dominan técnicas de tejido que llevan siglos
              perfeccionándose — y una plataforma que les permite llegar a personas
              que valoran ese trabajo.
            </p>
          </div>

          {/* Título a la derecha en desktop */}
          <div className="lg:col-span-5 lg:order-2 flex flex-col justify-center">
            <span
              className="block text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              Nuestra misión
            </span>
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Darle a la ropa típica la vitrina que siempre mereció
            </h3>
          </div>
        </div>
      </section>

      {/* ============================================
          PILARES — Los tres principios.
          Números enormes semitransparentes + texto.
          ============================================ */}
      <section
        className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
              >
                Lo que nos define
              </span>
              <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Tres principios, sin negociación
            </h2>
          </div>

          {/* Los tres pilares */}
          <div className="flex flex-col gap-16 sm:gap-20">
            {/* Pilar 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              <div className="lg:col-span-3 flex lg:justify-end">
                <span
                  className="text-8xl sm:text-9xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent)',
                    opacity: 0.15,
                    lineHeight: 1,
                  }}
                >
                  01
                </span>
              </div>
              <div className="lg:col-span-9">
                <h4
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  Comercio directo, sin intermediarios
                </h4>
                <p
                  className="text-base leading-relaxed max-w-2xl"
                  style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  Cada quetzal que pagás por una prenda va directo a quien la tejió.
                  No hay cadena de distribuidores, no hay margen de intermediarios.
                  La artesana recibe un pago justo y vos recibís una pieza con historia real,
                  no una etiqueta genérica.
                </p>
              </div>
            </div>

            {/* Línea separadora */}
            <div
              className="max-w-4xl mx-auto w-full"
              style={{ height: '1px', backgroundColor: 'var(--color-border)' }}
            />

            {/* Pilar 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              <div className="lg:col-span-3 flex lg:justify-end">
                <span
                  className="text-8xl sm:text-9xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent)',
                    opacity: 0.15,
                    lineHeight: 1,
                  }}
                >
                  02
                </span>
              </div>
              <div className="lg:col-span-9">
                <h4
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  Piezas únicas, no producción en serie
                </h4>
                <p
                  className="text-base leading-relaxed max-w-2xl"
                  style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  Cada güipil, cada corte, cada faja es irrepetible. Las combinaciones de colores,
                  los patrones del bordado, los detalles del tejido — todo es único. Cuando una
                  pieza se vende, no desaparece: queda visible en el catálogo con la opción de
                  solicitar una similar hecha a mano.
                </p>
              </div>
            </div>

            <div
              className="max-w-4xl mx-auto w-full"
              style={{ height: '1px', backgroundColor: 'var(--color-border)' }}
            />

            {/* Pilar 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              <div className="lg:col-span-3 flex lg:justify-end">
                <span
                  className="text-8xl sm:text-9xl font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent)',
                    opacity: 0.15,
                    lineHeight: 1,
                  }}
                >
                  03
                </span>
              </div>
              <div className="lg:col-span-9">
                <h4
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  Origen trazable, siempre
                </h4>
                <p
                  className="text-base leading-relaxed max-w-2xl"
                  style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  Cada pieza muestra el departamento y municipio exacto donde fue creada.
                  No es solo una etiqueta — es un reconocimiento a la comunidad que la produjo,
                  a las técnicas que preserva, y a la tradición que representa. Sabés exactamente
                  de dónde viene lo que llevás.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          VISIÓN — A dónde vamos.
          Texto centrado, tipografía grande.
          ============================================ */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-36">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="block text-xs uppercase tracking-[0.3em] mb-8"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
          >
            La visión
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-8"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Si funciona en Guatemala, puede funcionar en el mundo
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-6"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Perú tiene sus textiles. México tiene sus huipiles. Bolivia tiene sus aguayos.
            Cada país tiene una tradición textil que merece una plataforma digna.
            XAY empieza en Guatemala, pero el modelo está pensado para escalar.
          </p>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Imaginá poder comprar un textil artesanal de cualquier país del mundo
            desde tu teléfono, con fotos profesionales, información del origen,
            y la certeza de que tu dinero llegó a quien lo tejió.
            Ese es el futuro que estamos construyendo.
          </p>
        </div>
      </section>

      {/* ============================================
          EL NOMBRE — Explicación de XAY.
          Layout especial: letras separadas del nombre
          con significado de cada parte.
          ============================================ */}
      <section
        className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="block text-xs uppercase tracking-[0.3em] mb-12"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
          >
            El nombre
          </span>

          {/* Las letras del nombre separadas */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-16 mb-12">
            <div className="flex flex-col items-center">
              <span
                className="text-6xl sm:text-8xl lg:text-9xl font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1,
                }}
              >
                X
              </span>
              <div
                className="mt-3 mb-2"
                style={{ width: '30px', height: '1px', backgroundColor: 'var(--color-accent)' }}
              />
              <span
                className="text-xs sm:text-sm tracking-wider"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Xiquita
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span
                className="text-6xl sm:text-8xl lg:text-9xl font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1,
                }}
              >
                A
              </span>
              <div
                className="mt-3 mb-2"
                style={{ width: '30px', height: '1px', backgroundColor: 'var(--color-accent)' }}
              />
              <span
                className="text-xs sm:text-sm tracking-wider"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Ajquejay
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span
                className="text-6xl sm:text-8xl lg:text-9xl font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1,
                }}
              >
                Y
              </span>
              <div
                className="mt-3 mb-2"
                style={{ width: '30px', height: '1px', backgroundColor: 'var(--color-accent)' }}
              />
              <span
                className="text-xs sm:text-sm tracking-wider"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                &amp;
              </span>
            </div>
          </div>

          <p
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Tres letras. Dos apellidos guatemaltecos. Una idea que nació de la convicción
            de que lo nuestro merece ser visto por el mundo — con orgullo, con calidad,
            y sin pedir disculpas.
          </p>
        </div>
      </section>

      {/* ============================================
          CTA FINAL — Invitación a explorar.
          Fondo oscuro, texto claro, contraste fuerte.
          ============================================ */}
      <section
        className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-36"
        style={{ backgroundColor: 'var(--color-text-primary)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-inverse)',
            }}
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
          <a
            href="/tienda"
            className="inline-block px-10 py-3.5 text-sm font-medium about-cta-button"
          >
            Explorar la tienda
          </a>
        </div>
      </section>
    </div>
  )
}
