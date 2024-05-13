import Joi from 'joi'

export const roomValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.string().required(),
  type: Joi.string().required(),
  capacity: Joi.number().integer().required(),
  accessibility: Joi.boolean().optional(),
  maintenance: Joi.boolean().default(false),
  schedule: Joi.array()
    .items(
      Joi.object({
        date: Joi.string().required(),
        movie: Joi.string().required(),
      })
    )
    .optional(),
})
