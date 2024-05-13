import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { Repository } from 'typeorm'
import { Ticket } from '../database/entities/ticket'
import ApiError from '../utils/apiError'
import { Transaction } from '../database/entities/transaction'
import { User } from '../database/entities/user'

@injectable()
export class TicketService {
  constructor(
    @inject(TYPES.TicketRepository)
    private ticketRepository: Repository<Ticket>,
    @inject(TYPES.TransactionRepository)
    private transactionRepository: Repository<Transaction>,
    @inject(TYPES.UserRepository) private userRepository: Repository<User>
  ) {}

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

  async getUserTickets(userId: string) {
    const tickets = await this.ticketRepository.find({
      where: { user: { id: userId } },
      relations: ['attendances'],
    })
    return tickets
  }
}
