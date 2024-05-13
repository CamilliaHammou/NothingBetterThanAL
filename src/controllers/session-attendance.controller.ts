import { injectable } from 'inversify'
import { SessionAttendanceService } from '../services/session-attendance.service'
import { Request, Response } from 'express'
import { attendSessionSchema } from '../validators/attend-session.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'

@injectable()
export class SessionAttendanceController {
  constructor(private sessionAttendanceService: SessionAttendanceService) {}

  async attend(req: Request, res: Response) {
    const { value, error } = attendSessionSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const { sessionId, ticketId } = value
    const result = await this.sessionAttendanceService.attend(
      sessionId,
      ticketId
    )
    res.json(result)
  }

  async getHallAttendance(req: Request, res: Response) {
    const { startDate, endDate } = req.query
    const result = await this.sessionAttendanceService.getHallAttendance(
      req.params.id,
      startDate as string,
      endDate as string
    )
    res.json(result)
  }

  async getSessionAttendance(req: Request, res: Response) {
    const result = await this.sessionAttendanceService.getSessionAttendance(
      req.params.id
    )
    res.json(result)
  }

  async getTotalAttendance(req: Request, res: Response) {
    const { startDate, endDate } = req.query
    const result = await this.sessionAttendanceService.getTotalAttendance(
      startDate as string,
      endDate as string
    )
    res.json(result)
  }
}
