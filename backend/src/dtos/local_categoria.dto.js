import Joi from 'joi'

export const localCategoriaSchema = Joi.object({
  id_categoria: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID de la categoría debe ser un número.',
    'number.integer': 'El ID de la categoría debe ser un entero.',
    'number.positive': 'El ID de la categoría debe ser positivo.',
    'any.required': 'El ID de la categoría es obligatorio.'
  })
}).unknown(false)

export const asociacionCategoriaSchema = localCategoriaSchema.keys({
  id_local: Joi.number().integer().positive().required()
})
