import * as Express from 'express'
import { JwtPayload } from '../../src/types/jwtPayload'

//to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
