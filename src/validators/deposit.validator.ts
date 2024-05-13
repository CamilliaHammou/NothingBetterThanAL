import Joi from 'joi'

export const depositSchema = Joi.object({
  amount: Joi.number().greater(0).required(),
  card: Joi.string().creditCard().required(),
}).options({ stripUnknown: true })
