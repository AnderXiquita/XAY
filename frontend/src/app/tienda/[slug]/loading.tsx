
function Block({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-alt) 50%, var(--color-surface) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        borderRadius: '6px',
        ...style,
      }}
    />
  )
}

export default function ProductLoading() {
  return (
    <div className="max-w-screen-2xl mx-auto lg:px-[3%] pb-24 lg:pb-24" aria-busy="true" aria-label="Cargando producto">
      <div className="hidden lg:block pt-8 pb-6">
        <Block style={{ width: '260px', height: '14px' }} />
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-16">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="lg:hidden flex gap-1.5 pl-4 pt-3 overflow-hidden">
            <Block className="shrink-0" style={{ height: 'min(46svh, 100vw)', aspectRatio: '3/4' }} />
            <Block className="shrink-0" style={{ height: 'min(46svh, 100vw)', aspectRatio: '3/4' }} />
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-2">
            <Block style={{ aspectRatio: '4/5' }} />
            <Block style={{ aspectRatio: '4/5' }} />
          </div>
        </div>

        <div className="px-4 pt-4 lg:px-0 lg:pt-0 lg:col-span-5 xl:col-span-4 space-y-4">
          <Block style={{ width: '40%', height: '12px' }} />
          <Block style={{ width: '85%', height: '34px' }} />
          <Block style={{ width: '30%', height: '22px' }} />
          <div className="pt-4 space-y-3">
            <Block style={{ width: '50%', height: '12px' }} />
            <Block style={{ width: '60%', height: '28px' }} />
          </div>
          <Block className="hidden lg:block" style={{ height: '48px', borderRadius: '9999px', marginTop: '24px' }} />
          <div className="pt-4 space-y-3">
            <Block style={{ height: '12px' }} />
            <Block style={{ height: '12px' }} />
            <Block style={{ width: '70%', height: '12px' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
