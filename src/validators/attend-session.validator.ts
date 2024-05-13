import Joi from 'joi'

export const attendSessionSchema = Joi.object({
  ticketId: Joi.string().required(),
  sessionId: Joi.string().required(),
}).options({ stripUnknown: true })
