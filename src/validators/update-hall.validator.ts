import Joi from 'joi'

export const updateHallSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  capacity: Joi.number().integer().positive().min(15).max(30).required(),
  accessibility: Joi.boolean().required(),
  maintenance: Joi.boolean(),
})
