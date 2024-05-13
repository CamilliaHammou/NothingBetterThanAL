import { Request, Response } from 'express'
import { injectable } from 'inversify'
import { SessionService } from '../services/session.service'
import { createSessionSchema } from '../validators/create-session.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'

@injectable()
export class SessionController {
  constructor(private sessionService: SessionService) {}

  async create(req: Request, res: Response) {
    const { value, error } = createSessionSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const session = await this.sessionService.createSession({
      ...value,
      status: 'scheduled',
    })
    res.status(201).json(session)
  }

  async update(req: Request, res: Response) {
    const { value, error } = createSessionSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const session = await this.sessionService.updateSession(req.params.id, {
      ...value,
      status: 'scheduled',
    })
    res.status(200).json(session)
  }

  async getPaginated(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const result = await this.sessionService.getSessionsPaginated(page, limit)
    res.json(result)
  }

  async getSingle(req: Request, res: Response) {
    const session = await this.sessionService.getSession(req.params.id)
    res.json(session)
  }

  async delete(req: Request, res: Response) {
    await this.sessionService.deleteSession(req.params.id)
    res.json({ message: 'Session deleted successfully' })
  }

  async markComplete(req: Request, res: Response) {}

  async cancel(req: Request, res: Response) {}
}
