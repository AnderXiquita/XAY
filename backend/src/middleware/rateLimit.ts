import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import { AppError } from '../lib/AppError.js'

function emailFrom(body: unknown): string | null {
  if (typeof body === 'object' && body !== null && 'email' in body && typeof body.email === 'string') {
    return body.email.trim().toLowerCase()
  }
  return null
}

// por correo y no por IP: el login llega desde el servidor de Vercel, todos con la misma IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => emailFrom(req.body) ?? ipKeyGenerator(req.ip ?? ''),
  handler: (_req, _res, next) => {
    next(new AppError('Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.', 429, 'RATE_LIMITED'))
  },
})
