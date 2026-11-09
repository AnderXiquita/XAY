import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt.js'
import { AppError } from '../lib/AppError.js'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Necesitas iniciar sesión', 401, 'UNAUTHORIZED')
  }

  try {
    req.user = verifyToken(header.slice('Bearer '.length))
  } catch {
    throw new AppError('Tu sesión expiró, vuelve a iniciar sesión', 401, 'INVALID_TOKEN')
  }

  next()
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    throw new AppError('Acceso denegado', 403, 'FORBIDDEN')
  }
  next()
}
