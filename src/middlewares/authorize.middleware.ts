import { NextFunction, Request, Response } from 'express'
import AppDataSource from '../database/database'
import { User } from '../database/entities/user'

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOne({
      where: { id: req.user!.userId },
    })
    console.log(user)

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}
