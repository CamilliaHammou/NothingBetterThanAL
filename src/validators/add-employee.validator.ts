import Joi from 'joi'
import { userTypes } from '../constants/userTypes'

export const addEmployeeSchema = Joi.object({
  id: Joi.string().required(),
  role: Joi.string()
    .valid(
      userTypes.CONFECTIONERY,
      userTypes.PROJECTIONIST,
      userTypes.RECEPTION
    )
    .required(),
}).options({ stripUnknown: true })
