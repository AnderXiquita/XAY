import jwt, { type SignOptions } from 'jsonwebtoken'
import { UserRole } from '../generated/prisma/enums.js'

export interface TokenPayload {
  userId: string
  role: UserRole
}

const secret = process.env.JWT_SECRET
if (!secret || secret.length < 32) {
  throw new Error('JWT_SECRET falta o tiene menos de 32 caracteres')
}

const ISSUER = 'xay'

export function signToken(payload: TokenPayload): string {
  return jwt.sign({ userId: payload.userId, role: payload.role }, secret!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as NonNullable<SignOptions['expiresIn']>,
    issuer: ISSUER,
  })
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, secret!, { issuer: ISSUER })

  if (
    typeof decoded !== 'object' ||
    typeof decoded.userId !== 'string' ||
    !Object.values(UserRole).includes(decoded.role)
  ) {
    throw new Error('Token con formato inválido')
  }

  return { userId: decoded.userId, role: decoded.role }
}
