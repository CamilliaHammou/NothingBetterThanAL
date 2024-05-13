import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types/jwtPayload'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = header.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    if (!decode) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = decode
    next()
  } catch (error) {
    return res
      .status(401)
      .json({
        message: 'Unauthorized',
        error: error instanceof Error ? error.message : 'Error',
      })
  }
}
