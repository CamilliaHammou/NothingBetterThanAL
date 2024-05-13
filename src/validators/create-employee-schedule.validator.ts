import Joi from 'joi'

export const createEmployeeScheduleSchema = Joi.object({
  employeeId: Joi.string().required(),
  startTime: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  endTime: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  date: Joi.string().isoDate().required(),
  description: Joi.string().optional(),
})
