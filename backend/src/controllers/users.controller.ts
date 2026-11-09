import { Request, Response, NextFunction } from 'express'
import * as UsersService from '../services/users.service.js'
import type { AddressInput, ChangePasswordInput, UpdateProfileInput } from '../schemas/users.schema.js'

type IdParams = { id: string }

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UsersService.updateProfile(req.user!.userId, req.body as UpdateProfileInput)
    res.json({ data: user })
  } catch (error) {
    next(error)
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    await UsersService.changePassword(req.user!.userId, req.body as ChangePasswordInput)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function listAddresses(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ data: await UsersService.listAddresses(req.user!.userId) })
  } catch (error) {
    next(error)
  }
}

export async function createAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await UsersService.createAddress(req.user!.userId, req.body as AddressInput)
    res.status(201).json({ data: address })
  } catch (error) {
    next(error)
  }
}

export async function updateAddress(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const address = await UsersService.updateAddress(req.user!.userId, req.params.id, req.body as AddressInput)
    res.json({ data: address })
  } catch (error) {
    next(error)
  }
}

export async function setDefaultAddress(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    await UsersService.setDefaultAddress(req.user!.userId, req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export async function deleteAddress(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    await UsersService.deleteAddress(req.user!.userId, req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
