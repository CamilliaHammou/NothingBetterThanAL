import { injectable } from 'inversify'
import { EmployeeScheduleService } from '../services/employee-schedule.service'
import { Request, Response } from 'express'
import { createEmployeeScheduleSchema } from '../validators/create-employee-schedule.validator'
import { generateValidationErrorMessage } from '../validators/generate-validation-message'

@injectable()
export class EmployeeScheduleController {
  constructor(private employeeScheduleService: EmployeeScheduleService) {}

  async create(req: Request, res: Response) {
    const { value, error } = createEmployeeScheduleSchema.validate(req.body)
    if (error) {
      res.status(400).send(generateValidationErrorMessage(error.details))
      return
    }
    const result = await this.employeeScheduleService.createSchedule(value)
    res.status(201).json(result)
  }

  async getEmployeeSchedule(req: Request, res: Response) {
    const { startDate, endDate } = req.query
    const schedule = await this.employeeScheduleService.getEmployeeSchedule({
      employeeId: req.params.id,
      startDate: startDate as string,
      endDate: endDate as string,
    })

    res.json(schedule)
  }

  async getSelfSchedule(req: Request, res: Response) {
    const { startDate, endDate } = req.query
    const schedule = await this.employeeScheduleService.getEmployeeSchedule({
      employeeId: req.user!.userId,
      startDate: startDate as string,
      endDate: endDate as string,
    })

    res.json(schedule)
  }
}
