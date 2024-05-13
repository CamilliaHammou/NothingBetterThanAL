import Joi from 'joi'

export const buyTicketSchema = Joi.object({
  ticketType: Joi.string().valid('regular', 'super').required(),
}).options({ stripUnknown: true })
