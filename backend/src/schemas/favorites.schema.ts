import { z } from 'zod'

export const mergeFavoritesSchema = z.object({
  product_ids: z.array(z.string().min(1).max(64)).max(100, 'Demasiados favoritos'),
})

export type MergeFavoritesInput = z.infer<typeof mergeFavoritesSchema>
