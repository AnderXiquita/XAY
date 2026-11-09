import { Request, Response, NextFunction } from 'express'
import * as FavoritesService from '../services/favorites.service.js'
import type { MergeFavoritesInput } from '../schemas/favorites.schema.js'

type ProductParams = { productId: string }

export async function listFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await FavoritesService.listFavorites(req.user!.userId) })
  } catch (error) {
    next(error)
  }
}

export async function listFavoriteIds(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await FavoritesService.listFavoriteIds(req.user!.userId) })
  } catch (error) {
    next(error)
  }
}

export async function addFavorite(req: Request<ProductParams>, res: Response, next: NextFunction) {
  try {
    await FavoritesService.addFavorite(req.user!.userId, req.params.productId)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function removeFavorite(req: Request<ProductParams>, res: Response, next: NextFunction) {
  try {
    await FavoritesService.removeFavorite(req.user!.userId, req.params.productId)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function mergeFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const ids = await FavoritesService.mergeFavorites(req.user!.userId, (req.body as MergeFavoritesInput).product_ids)
    res.json({ data: ids })
  } catch (error) {
    next(error)
  }
}
