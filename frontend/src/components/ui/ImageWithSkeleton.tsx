'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'

/* Imagen con efecto shimmer mientras carga.
   El skeleton va DETRÁS de la imagen (sin z-index).
   Mientras la imagen no carga, es transparente y se ve el shimmer.
   Cuando carga, la imagen cubre el shimmer naturalmente. */
export default function ImageWithSkeleton(props: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-alt) 50%, var(--color-surface) 75%)',
          backgroundSize: '200% 100%',
          animation: loaded ? 'none' : 'shimmer 1.5s ease-in-out infinite',
          opacity: loaded ? 0 : 1,
          transition: 'opacity 400ms ease',
        }}
      />
      <Image
        {...props}
        onLoad={(e) => {
          setLoaded(true)
          if (typeof props.onLoad === 'function') {
            (props.onLoad as (e: React.SyntheticEvent<HTMLImageElement>) => void)(e)
          }
        }}
      />
    </>
  )
}
