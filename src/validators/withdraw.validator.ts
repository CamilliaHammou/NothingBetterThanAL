import Joi from 'joi'

export const withdrawSchema = Joi.object({
  amount: Joi.number().greater(0).required(),
  bankAccount: Joi.string().required(),
}).options({ stripUnknown: true })
