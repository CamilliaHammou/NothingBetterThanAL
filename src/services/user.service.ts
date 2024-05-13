import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { Repository } from 'typeorm'
import { User } from '../database/entities/user'
import jwt from 'jsonwebtoken'
import { RefreshToken } from '../database/entities/refreshToken'
import { SignupDto } from '../dtos/signup.dto'
import bcrypt from 'bcryptjs'
import { LoginDto } from '../dtos/login.dto'
import ApiError from '../utils/apiError'
import { CreateEmployeeDto } from '../dtos/create-employee.dto'
import { userTypes } from '../constants/userTypes'

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: Repository<User>,
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async signup(
    user: SignupDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.userRepository.findOneBy({
      email: user.email,
    })
    if (existingUser) throw new ApiError(400, 'User already exists')
    const hashedPassword = await bcrypt.hash(user.password, 8)
    user.password = hashedPassword
    const newUser = await this.userRepository.save(user)
    const refreshToken = await this.generateAndSaveRefreshToken(newUser)
    const accessToken = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )
    return { accessToken, refreshToken }
  }

  async login(
    data: LoginDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOneBy({ email: data.email })
    if (!user) {
      throw new ApiError(400, 'User not found')
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
      throw new ApiError(400, 'Invalid credentials')
    }

    const refreshToken = await this.generateAndSaveRefreshToken(user)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )
    return { accessToken, refreshToken }
  }

  async logout(token: string) {
    await this.refreshTokenRepository.delete({
      token: token,
    })
  }

  async refreshToken(oldRefreshToken: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
      relations: ['user'],
    })

    if (!refreshToken) {
      throw new ApiError(401, 'Invalid refresh token')
    }

    const now = new Date()

    if (refreshToken.expiryDate < now) {
      throw new ApiError(401, 'Refresh token has expired')
    }

    const user = refreshToken.user
    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    )

    refreshToken.token = newRefreshToken
    await this.refreshTokenRepository.save(refreshToken)

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    //return the user profile, omitting sensitive information like passwords
    const { password, refreshTokens, ...profile } = user
    return profile
  }

  async getUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    })

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getEmployees(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      where: [
        { role: userTypes.CONFECTIONERY },
        { role: userTypes.PROJECTIONIST },
        { role: userTypes.RECEPTION },
      ],
    })
    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }
  async addEmployee(userId: string, role: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    user.role = role
    await this.userRepository.save(user)
    const { password, refreshTokens, ...userData } = user
    return userData
  }

  async createEmployee(data: CreateEmployeeDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: data.email,
    })
    if (existingUser) throw new ApiError(400, 'User already exists')
    const hashedPassword = await bcrypt.hash(data.password, 8)
    data.password = hashedPassword
    const newUser = await this.userRepository.save(data)
    return newUser
  }

  async generateAndSaveRefreshToken(user: User): Promise<string> {
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    )

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)

    await this.refreshTokenRepository.save({
      token: refreshToken,
      user,
      expiryDate,
    })

    return refreshToken
  }

  async validateRefreshToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    })
    if (!refreshToken || refreshToken.expiryDate < new Date()) {
      return null
    }
    return refreshToken
  }
}
