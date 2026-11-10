import { Request, Response, NextFunction } from 'express'
import * as CartService from '../services/cart.service.js'
import { AppError } from '../lib/AppError.js'
import type { AddCartItemInput, UpdateCartItemInput } from '../schemas/cart.schema.js'

type ProductParams = { productId: string }

const EMPTY_CART = { items: [], count: 0, subtotal: '0.00' }

function ownerOf(req: Request): CartService.CartOwner | null {
  if (req.user) return { user_id: req.user.userId }
  if (req.cartSession) return { session_id: req.cartSession }
  return null
}

function requireOwner(req: Request) {
  const owner = ownerOf(req)
  if (!owner) throw new AppError('No encontramos tu carrito', 400, 'CART_SESSION_REQUIRED')
  return owner
}

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const owner = ownerOf(req)
    res.json({ data: owner ? await CartService.getCart(owner) : EMPTY_CART })
  } catch (error) {
    next(error)
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { product_id, quantity } = req.body as AddCartItemInput
    res.json({ data: await CartService.addItem(requireOwner(req), product_id, quantity) })
  } catch (error) {
    next(error)
  }
}

export async function updateItem(req: Request<ProductParams>, res: Response, next: NextFunction) {
  try {
    const { quantity } = req.body as UpdateCartItemInput
    res.json({ data: await CartService.updateItem(requireOwner(req), req.params.productId, quantity) })
  } catch (error) {
    next(error)
  }
}

export async function removeItem(req: Request<ProductParams>, res: Response, next: NextFunction) {
  try {
    res.json({ data: await CartService.removeItem(requireOwner(req), req.params.productId) })
  } catch (error) {
    next(error)
  }
}

export async function mergeCart(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Necesitas iniciar sesión', 401, 'UNAUTHORIZED')
    if (!req.cartSession) return res.json({ data: await CartService.getCart({ user_id: req.user.userId }) })
    res.json({ data: await CartService.mergeGuestCart(req.user.userId, req.cartSession) })
  } catch (error) {
    next(error)
  }
}
