import Joi from 'joi'

export const updateSessionSchema = Joi.object({
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().required(),
  hallId: Joi.string().required(),
  movieId: Joi.string().required(),
})
