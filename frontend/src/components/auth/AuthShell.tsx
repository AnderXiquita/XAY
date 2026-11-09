import Image from 'next/image'

interface AuthShellProps {
  eyebrow?: string
  title: string
  subtitle: string
  image?: string
  children: React.ReactNode
}

export default function AuthShell({ eyebrow = 'Mi cuenta', title, subtitle, image = '/image/Artesanas.jpg', children }: AuthShellProps) {
  return (
    <section className="px-6 sm:px-10 lg:px-20 pt-10 sm:pt-14 lg:pt-20 pb-20 sm:pb-24 lg:pb-28">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto lg:mx-0">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>
              {eyebrow}
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            {title}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed mb-10" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
            {subtitle}
          </p>
          {children}
        </div>

        <div className="hidden lg:block lg:col-span-6 xl:col-span-6 xl:col-start-7">
          <div className="relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '4 / 5' }}>
            <Image src={image} alt="" fill priority sizes="(min-width: 1280px) 560px, 50vw" className="object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(9, 31, 44, 0.6), transparent 55%)' }}
            />
            <p
              className="absolute left-10 right-10 bottom-10 text-2xl leading-snug italic"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)' }}
            >
              “Cada pieza guarda la historia de quien la tejió.”
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
