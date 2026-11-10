import { Request, Response, NextFunction } from 'express'
import * as Products from '../services/admin-products.service.js'
import * as Catalog from '../services/admin-catalog.service.js'
import * as Users from '../services/admin-users.service.js'
import type { CategoryInput, ProductInput, SupplierInput } from '../schemas/admin.schema.js'

type IdParams = { id: string }
type Handler<P = Record<string, string>> = (req: Request<P>, res: Response) => Promise<void>

// todos los handlers del panel pasan sus errores al errorHandler
const wrap =
  <P = Record<string, string>>(handler: Handler<P>) =>
  async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await handler(req, res)
    } catch (error) {
      next(error)
    }
  }

const numericId = (req: Request<IdParams>) => Number.parseInt(req.params.id) || 0
const query = (req: Request) => req.query as Record<string, string>

export const stats = wrap(async (_req, res) => {
  res.json({ data: await Products.getStats() })
})

export const listProducts = wrap(async (req, res) => {
  res.json(await Products.listProducts(query(req)))
})

export const getProduct = wrap<IdParams>(async (req, res) => {
  res.json({ data: await Products.getProduct(req.params.id) })
})

export const createProduct = wrap(async (req, res) => {
  res.status(201).json({ data: await Products.createProduct(req.body as ProductInput) })
})

export const updateProduct = wrap<IdParams>(async (req, res) => {
  res.json({ data: await Products.updateProduct(req.params.id, req.body as ProductInput) })
})

export const listCategories = wrap(async (_req, res) => {
  res.json({ data: await Catalog.listCategories() })
})

export const createCategory = wrap(async (req, res) => {
  res.status(201).json({ data: await Catalog.createCategory(req.body as CategoryInput) })
})

export const updateCategory = wrap<IdParams>(async (req, res) => {
  res.json({ data: await Catalog.updateCategory(numericId(req), req.body as CategoryInput) })
})

export const listSuppliers = wrap(async (_req, res) => {
  res.json({ data: await Catalog.listSuppliers() })
})

export const createSupplier = wrap(async (req, res) => {
  res.status(201).json({ data: await Catalog.createSupplier(req.body as SupplierInput) })
})

export const updateSupplier = wrap<IdParams>(async (req, res) => {
  res.json({ data: await Catalog.updateSupplier(numericId(req), req.body as SupplierInput) })
})

export const listUsers = wrap(async (req, res) => {
  res.json(await Users.listUsers(query(req)))
})

export const setUserActive = wrap<IdParams>(async (req, res) => {
  res.json({ data: await Users.setUserActive(req.user!.userId, req.params.id, (req.body as { is_active: boolean }).is_active) })
})
