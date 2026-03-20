import { Request, Response, NextFunction } from 'express'
import * as CategoryService from '../services/categories.service.js'

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await CategoryService.getCategories()
    res.json({ data: categories })
  } catch (error) {
    next(error)
  }
}
