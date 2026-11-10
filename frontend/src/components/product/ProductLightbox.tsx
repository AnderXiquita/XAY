'use client'

import type { ProductImage } from '@/lib/api'
import MediaLightbox from '@/components/ui/MediaLightbox'

interface ProductLightboxProps {
  media: ProductImage[]
  initialIndex: number
  productName: string
  onClose: () => void
}

export default function ProductLightbox({ media, initialIndex, productName, onClose }: ProductLightboxProps) {
  return <MediaLightbox media={media} initialIndex={initialIndex} productName={productName} onClose={onClose} />
}
