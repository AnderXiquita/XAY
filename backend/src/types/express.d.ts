import type { TokenPayload } from '../lib/jwt.js'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
      cartSession?: string
    }
  }
}

export {}
