import { z } from 'zod'

// acepta "5555-1234", "5555 1234" o "+502 5555 1234" y lo guarda como "5555 1234"
const phone = z
  .string({ error: 'Escribe un teléfono' })
  .trim()
  .transform((value) => value.replace(/\D/g, '').replace(/^502(?=\d{8}$)/, ''))
  .refine((digits) => /^\d{8}$/.test(digits), 'Escribe un teléfono de 8 dígitos')
  .transform((digits) => `${digits.slice(0, 4)} ${digits.slice(4)}`)

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable().optional())

const birthDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')
  .transform((value) => new Date(`${value}T00:00:00Z`))
  .refine((date) => !Number.isNaN(date.getTime()), 'Fecha inválida')
  .refine((date) => date.getUTCFullYear() >= 1900 && date < new Date(), 'Fecha inválida')

const text = (min: number, max: number, message: string) =>
  z.string({ error: message }).trim().min(min, message).max(max, `Máximo ${max} caracteres`)

export const updateProfileSchema = z.object({
  name: text(2, 80, 'Escribe tu nombre'),
  phone: optional(phone),
  birth_date: optional(birthDate),
})

export const addressSchema = z.object({
  label: text(1, 40, 'Ponle un nombre, por ejemplo "Casa"'),
  recipient_name: text(2, 80, 'Escribe quién recibe'),
  phone,
  department_id: z.coerce.number({ error: 'Elige un departamento' }).int().positive('Elige un departamento'),
  municipality_id: z.coerce.number({ error: 'Elige un municipio' }).int().positive('Elige un municipio'),
  zone: optional(text(1, 20, 'Zona inválida')),
  address_line: text(5, 200, 'Escribe la dirección'),
  reference: optional(text(1, 300, 'Referencia inválida')),
  is_default: z.boolean().optional(),
})

export const changePasswordSchema = z.object({
  current_password: z.string({ error: 'Escribe tu contraseña actual' }).min(1, 'Escribe tu contraseña actual').max(72),
  new_password: z.string({ error: 'Escribe la nueva contraseña' }).min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
