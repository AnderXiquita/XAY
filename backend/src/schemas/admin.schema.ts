import { z } from 'zod'

const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? null : v), z.string().trim().max(max, `Máximo ${max} caracteres`).nullable().optional())

const optionalId = z.preprocess((v) => (v === '' || v === null ? null : v), z.coerce.number().int().positive().nullable().optional())

const optionalCm = z.preprocess(
  (v) => (v === '' || v === null ? null : v),
  z.coerce.number().positive('Debe ser mayor a 0').max(1000, 'Máximo 1000 cm').nullable().optional(),
)

export const productSchema = z.object({
  name: z.string({ error: 'Escribe el nombre' }).trim().min(3, 'Mínimo 3 caracteres').max(120, 'Máximo 120 caracteres'),
  slug: optionalText(80),
  description: optionalText(4000),
  price: z.coerce.number({ error: 'Escribe el precio' }).positive('El precio debe ser mayor a 0').max(999999, 'Precio demasiado alto'),
  category_id: z.coerce.number({ error: 'Elige una categoría' }).int().positive('Elige una categoría'),
  municipality_id: optionalId,
  supplier_id: optionalId,
  is_traditional: z.boolean(),
  status: z.enum(['draft', 'available', 'sold', 'coming_soon'], { error: 'Elige un estado válido' }),
  width_cm: optionalCm,
  length_cm: optionalCm,
  size_label: optionalText(40),
  size_notes: optionalText(300),
  fabric_type: optionalText(80),
  embroidery_type: z.preprocess((v) => (v === '' ? null : v), z.enum(['hand', 'machine', 'mixed']).nullable().optional()),
  colors: z.array(z.string().trim().min(1).max(30)).max(12, 'Máximo 12 colores').default([]),
  is_featured: z.boolean().default(false),
  allow_similar_request: z.boolean().default(true),
  quantity: z.coerce.number().int().min(0, 'No puede ser negativo').max(9999).default(1),
})

export const categorySchema = z.object({
  name: z.string({ error: 'Escribe el nombre' }).trim().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  description: optionalText(300),
  is_active: z.boolean().default(true),
})

export const supplierSchema = z.object({
  name: z.string({ error: 'Escribe el nombre' }).trim().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  contact_name: optionalText(80),
  email: z.preprocess((v) => (v === '' ? null : v), z.email('Correo inválido').nullable().optional()),
  phone: optionalText(30),
  notes: optionalText(500),
  is_active: z.boolean().default(true),
})

export const userStatusSchema = z.object({ is_active: z.boolean() })

export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type SupplierInput = z.infer<typeof supplierSchema>
