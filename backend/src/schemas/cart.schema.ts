import { z } from 'zod'

const quantity = z.coerce.number().int().min(1, 'Mínimo 1').max(20, 'Máximo 20')

export const addCartItemSchema = z.object({
  product_id: z.string().min(1).max(64),
  quantity: quantity.optional(),
})

export const updateCartItemSchema = z.object({ quantity })

export type AddCartItemInput = z.infer<typeof addCartItemSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
