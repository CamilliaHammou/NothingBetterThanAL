import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { Repository } from 'typeorm'
import { Transaction } from '../database/entities/transaction'
import { Ticket } from '../database/entities/ticket'
import { User } from '../database/entities/user'
import ApiError from '../utils/apiError'

@injectable()
export class TransactionService {
  constructor(
    @inject(TYPES.TransactionRepository)
    private transactionRepository: Repository<Transaction>,
    @inject(TYPES.TicketRepository)
    private ticketRepository: Repository<Ticket>,
    @inject(TYPES.UserRepository) private userRepository: Repository<User>
  ) {}

  async deposit(userId: string, amount: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new ApiError(404, 'User not found.')
    }
    user.balance += amount
    await this.userRepository.save(user)
    const transaction = await this.transactionRepository.save({
      amount,
      type: 'deposit',
      date: new Date(),
      user,
    })

    return { balance: user.balance, transaction }
  }

  async withdraw(userId: string, amount: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new ApiError(404, 'User not found.')
    }
    if (user.balance < amount) {
      throw new ApiError(400, 'Insufficient balance.')
    }
    user.balance -= amount
    await this.userRepository.save(user)
    const transaction = await this.transactionRepository.save({
      amount,
      type: 'withdrawal',
      date: new Date(),
      user,
    })

    return { balance: user.balance, transaction }
  }

  async buyTicket(userId: string, ticketType: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new ApiError(404, 'User not found.')
    }
    const ticketCost = ticketType === 'super' ? 20 : 10
    if (user.balance < ticketCost) {
      throw new ApiError(400, 'Insufficient balance to buy ticket.')
    }

    const ticket = await this.ticketRepository.save({
      user,
      type: ticketType,
      purchaseDate: new Date(),
    })
    user.balance -= ticketCost
    await this.userRepository.save(user)
    const transaction = await this.transactionRepository.save({
      amount: ticketCost,
      type: 'ticket_purchased',
      date: new Date(),
      user,
    })
    return { balance: user.balance, ticket, transaction }
  }

  async getTransactions(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new ApiError(404, 'User not found.')
    }
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
    })
    return { balance: user.balance, transactions }
  }
}
