import { Request, Response } from 'express'
import { injectable } from 'inversify'
import { TicketService } from '../services/ticket.service'
import { buyTicketSchema } from '../validators/buy-ticket.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'

@injectable()
export class TicketController {
  constructor(private ticketService: TicketService) {}

  async buyTicket(req: Request, res: Response) {
    const { value, error } = buyTicketSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const result = await this.ticketService.buyTicket(
      req.user!.userId,
      value.ticketType
    )
    res.json(result)
  }

  async getUserTickets(req: Request, res: Response) {
    const tickets = await this.ticketService.getUserTickets(req.user!.userId)
    res.json(tickets)
  }
}
