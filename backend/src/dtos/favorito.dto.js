import Joi from 'joi'

export const favoritoSchema = Joi.object({
  id_local: Joi.number().integer().positive().required()
}).unknown(false)
