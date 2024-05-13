import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { injectable } from 'inversify'
import { signupSchema } from '../validators/signup.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'
import { loginSchema } from '../validators/login.validator'
import { SignupDto } from '../dtos/signup.dto'
import ApiError from '../utils/apiError'
import { addEmployeeSchema } from '../validators/add-employee.validator'
import { createEmployeeSchema } from '../validators/create-employee.validator'

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  async signup(req: Request, res: Response) {
    const { error, value } = signupSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const { accessToken, refreshToken } = await this.userService.signup(
      value as SignupDto
    )
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    res.status(201).json({ accessToken })
  }

  async login(req: Request, res: Response) {
    const { error, value } = loginSchema.validate(req.body)
    console.log(value)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const { refreshToken, accessToken } = await this.userService.login(value)
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    res.status(200).json({ accessToken })
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required.')
    }
    await this.userService.logout(refreshToken)
    res.clearCookie('refreshToken', { path: '/refresh_token' })
    res.status(200).send('Logged out successfully.')
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required')
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.userService.refreshToken(refreshToken)
    res.cookie('refreshToken', newRefreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    res.status(200).json({ accessToken })
  }

  async getProfile(req: Request, res: Response) {
    const profile = await this.userService.getProfile(req.user!.userId)

    res.json(profile)
  }

  async getUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const result = await this.userService.getUsers(page, limit)
    res.json(result)
  }

  async getEmployees(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const result = await this.userService.getEmployees(page, limit)
    res.json(result)
  }

  async addEmployee(req: Request, res: Response) {
    const { error, value } = addEmployeeSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const user = await this.userService.addEmployee(value.id, value.role)
    res.json(user)
  }

  async createEmployee(req: Request, res: Response) {
    const { error, value } = createEmployeeSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const user = await this.userService.createEmployee(value)
    res.json(user)
  }
}
