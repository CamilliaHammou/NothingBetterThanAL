import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import { EmployeeSchedule } from '../database/entities/employeeSchedule'
import { CreateEmployeeScheduleDto } from '../dtos/create-employee-schedule.dto'
import ApiError from '../utils/apiError'

@injectable()
export class EmployeeScheduleService {
  constructor(
    @inject(TYPES.EmployeeScheduleRepository)
    private employeeScheduleRepository: Repository<EmployeeSchedule>
  ) {}

  async createSchedule(scheduleData: CreateEmployeeScheduleDto) {
    const schedule = this.employeeScheduleRepository.save(scheduleData)
    return schedule
  }

  async getEmployeeSchedule(data: {
    employeeId: string
    startDate: string
    endDate: string
  }) {
    const { employeeId, startDate, endDate } = data
    const schedule = await this.employeeScheduleRepository.find({
      where: {
        employeeId: employeeId,
        date: Between(new Date(startDate), new Date(endDate)),
      },
      order: {
        date: 'ASC',
      },
    })
    return schedule
  }
}
