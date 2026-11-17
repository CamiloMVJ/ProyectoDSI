import Joi from 'joi'

export const favoritoSchema = Joi.object({
  id_local: Joi.number().integer().positive().max(2147483647).required()
}).unknown(false)
