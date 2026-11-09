import Image from 'next/image'

interface AuthShellProps {
  eyebrow?: string
  title: string
  subtitle: string
  image?: string
  footer?: React.ReactNode
  aside?: React.ReactNode
  children: React.ReactNode
}

function Eyebrow({ text, inverse }: { text: string; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-4 lg:mb-6">
      <span
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: inverse ? 'var(--color-text-inverse)' : 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
      >
        {text}
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: inverse ? 'rgba(255, 251, 244, 0.35)' : 'var(--color-border)' }} />
    </div>
  )
}

const titleClass = 'text-3xl sm:text-4xl font-bold leading-tight'

export default function AuthShell({ eyebrow = 'Mi cuenta', title, subtitle, image = '/image/Artesanas.jpg', footer, aside, children }: AuthShellProps) {
  return (
    <section data-auth-page className="lg:px-20 lg:pt-20 lg:pb-28">
      <div className="auth-shell flex flex-col lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center max-w-6xl mx-auto">
        {/* la foto toma el alto que sobra para que el login quepa sin scroll */}
        <div className="lg:hidden relative overflow-hidden" style={{ flex: '1 0 var(--auth-hero-min, 170px)', maxHeight: '300px' }}>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(9, 31, 44, 0.88) 0%, rgba(9, 31, 44, 0.35) 60%, rgba(9, 31, 44, 0.15) 100%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-12 sm:px-10">
            <Eyebrow text={eyebrow} inverse />
            <p className={titleClass} style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}>
              {title}
            </p>
          </div>
        </div>

        <div
          className="relative shrink-0 -mt-6 rounded-t-3xl px-6 pt-8 pb-8 sm:px-10 lg:mt-0 lg:rounded-none lg:p-0 lg:col-span-6 xl:col-span-5"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="hidden lg:block">
              <Eyebrow text={eyebrow} />
            </div>
            <h1 className={`${titleClass} sr-only lg:not-sr-only lg:block lg:mb-4`} style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              {title}
            </h1>
            <p className="auth-subtitle text-sm lg:text-base leading-relaxed mb-8 lg:mb-10" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              {subtitle}
            </p>
            {children}
            {footer && <div className="mt-10 lg:mt-12">{footer}</div>}
          </div>
        </div>

        {/* con aside (botones) la columna queda fija al hacer scroll, así siempre están a la vista */}
        <div className={`hidden lg:block lg:col-span-6 xl:col-start-7 ${aside ? 'lg:self-stretch' : ''}`}>
          <div className={aside ? 'lg:sticky lg:top-28' : ''}>
            {aside && <div className="mb-6">{aside}</div>}
            <div className="relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', aspectRatio: aside ? '1 / 1' : '4 / 5' }}>
              <Image src={image} alt="" fill sizes="(min-width: 1280px) 560px, 50vw" className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9, 31, 44, 0.6), transparent 55%)' }} />
              <p
                className="absolute left-10 right-10 bottom-10 text-2xl leading-snug italic"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}
              >
                “Cada pieza guarda la historia de quien la tejió.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
