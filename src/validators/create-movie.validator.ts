import Joi from 'joi'

export const createMovieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  duration: Joi.number().positive(),
})
