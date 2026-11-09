import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError } from '../lib/AppError.js'

export function validate(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      throw new AppError('Revisa los datos del formulario', 400, 'VALIDATION_ERROR', z.flattenError(result.error).fieldErrors)
    }
    req.body = result.data
    next()
  }
}
