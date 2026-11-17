import Joi from 'joi'

export const departamentoSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'El nombre del departamento es obligatorio.',
    'string.min': 'El nombre debe tener al menos 2 caracteres.',
    'string.max': 'El nombre no puede superar los 100 caracteres.',
    'any.required': 'El nombre del departamento es obligatorio.'
  }),
  tipo: Joi.string().valid('Departamento', 'Región autónoma').required().messages({
    'any.only': 'El tipo debe ser Departamento o Región autónoma.',
    'any.required': 'El tipo es obligatorio.'
  })
}).unknown(false)

export const updateDepartamentoSchema = departamentoSchema
  .fork(['nombre', 'tipo'], schema => schema.optional())
  .min(1)
  .required()
  .messages({ 'object.min': 'Debés enviar al menos un campo para actualizar.' })
