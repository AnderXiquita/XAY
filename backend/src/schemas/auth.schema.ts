import { z } from 'zod'

const email = z
  .string({ error: 'Escribe tu correo' })
  .trim()
  .toLowerCase()
  .max(254, 'Correo demasiado largo')
  .pipe(z.email('Escribe un correo válido'))

export const registerSchema = z.object({
  name: z.string({ error: 'Escribe tu nombre' }).trim().min(2, 'Escribe tu nombre').max(80, 'Nombre demasiado largo'),
  email,
  // bcrypt solo usa los primeros 72 bytes
  password: z.string({ error: 'Escribe una contraseña' }).min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
})

export const loginSchema = z.object({
  email,
  password: z.string({ error: 'Escribe tu contraseña' }).min(1, 'Escribe tu contraseña').max(72, 'Máximo 72 caracteres'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
