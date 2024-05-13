import { Request, Response } from 'express'
import { injectable } from 'inversify'
import { TransactionService } from '../services/transaction.service'
import { depositSchema } from '../validators/deposit.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'
import { withdrawSchema } from '../validators/withdraw.validator'
import { buyTicketSchema } from '../validators/buy-ticket.validator'

@injectable()
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async deposit(req: Request, res: Response) {
    const { value, error } = depositSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const result = await this.transactionService.deposit(
      req.user!.userId,
      value.amount
    )
    res.json(result)
  }

  async withdraw(req: Request, res: Response) {
    const { value, error } = withdrawSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const result = await this.transactionService.withdraw(
      req.user!.userId,
      value.amount
    )
    res.json(result)
  }

  async buyTicket(req: Request, res: Response) {
    const { value, error } = buyTicketSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const result = await this.transactionService.buyTicket(
      req.user!.userId,
      value.ticketType
    )
    res.json(result)
  }

  async getTransactions(req: Request, res: Response) {
    const result = await this.transactionService.getTransactions(
      req.user!.userId
    )
    res.json(result)
  }

  async getUserTransactions(req: Request, res: Response) {
    const result = await this.transactionService.getTransactions(req.params.id)
    res.json(result)
  }
}
