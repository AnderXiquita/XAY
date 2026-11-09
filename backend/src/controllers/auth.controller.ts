import { Request, Response, NextFunction } from 'express'
import * as AuthService from '../services/auth.service.js'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js'

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.register(req.body as RegisterInput)
    res.status(201).json({ data: result })
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.login(req.body as LoginInput)
    res.json({ data: result })
  } catch (error) {
    next(error)
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await AuthService.getMe(req.user!.userId)
    res.json({ data: user })
  } catch (error) {
    next(error)
  }
}
