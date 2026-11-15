import Joi from 'joi'

export const solicitudRegistroSchema = Joi.object({
  nombre_negocio: Joi.string().trim().max(150).required(),
  codigo_ruc: Joi.string().trim().max(50).required(),
  descripcion: Joi.string().trim().allow('').optional(),
  municipio: Joi.string().trim().max(100).required(),
  direccion_exacta: Joi.string().trim().required(),
  id_departamento: Joi.number().integer().positive().required(),
})
