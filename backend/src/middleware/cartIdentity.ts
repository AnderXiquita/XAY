import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt.js'
import { AppError } from '../lib/AppError.js'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// el carrito funciona con sesión (token) o como invitado (id de carrito que guarda el frontend en una cookie)
export function cartIdentity(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice('Bearer '.length))
    } catch {
      throw new AppError('Tu sesión expiró, vuelve a iniciar sesión', 401, 'INVALID_TOKEN')
    }
  }

  const session = req.headers['x-cart-session']
  if (typeof session === 'string' && UUID.test(session)) {
    req.cartSession = session
  }

  next()
}
