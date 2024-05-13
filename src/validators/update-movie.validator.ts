import Joi from 'joi'

export const updateMovieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  duration: Joi.number().positive(),
})
