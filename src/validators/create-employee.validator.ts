import Joi from 'joi'
import { userTypes } from '../constants/userTypes'

export const createEmployeeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(
      userTypes.CONFECTIONERY,
      userTypes.PROJECTIONIST,
      userTypes.RECEPTION
    )
    .required(),
}).options({ stripUnknown: true })
