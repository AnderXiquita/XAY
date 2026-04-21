import { Request, Response, NextFunction } from 'express'
import * as ProductService from '../services/products.service.js'

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ProductService.getProducts(req.query as Record<string, string>)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductService.getProductBySlug(String(req.params['slug'] ?? ''))
    res.json({ data: product })
  } catch (error) {
    next(error)
  }
}
