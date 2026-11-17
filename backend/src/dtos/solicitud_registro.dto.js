import Joi from 'joi'

export const solicitudRegistroSchema = Joi.object({
  nombre_negocio: Joi.string().trim().max(150).required(),
  razon_social: Joi.string().trim().max(150).allow('', null).optional(),
  codigo_ruc: Joi.string().trim().max(50).required(),
  numero_cedula_solicitante: Joi.string().trim().max(30).allow('', null).optional(),
  tipo_persona: Joi.string().valid('Persona Natural', 'Persona Jurídica').allow(null).optional(),
  descripcion: Joi.string().trim().allow('').optional(),
  es_independiente: Joi.boolean().optional(),
  id_complejo_padre: Joi.number().integer().positive().max(2147483647).allow(null).optional(),
  municipio: Joi.string().trim().max(100).required(),
  direccion_exacta: Joi.string().trim().required(),
  maps_link: Joi.string().trim().max(255).allow('', null).optional(),
  telefono_contacto: Joi.string().trim().max(30).allow('', null).optional(),
  correo_contacto: Joi.string().trim().max(150).allow('', null).optional(),
  sitio_web: Joi.string().trim().max(255).allow('', null).optional(),
  id_departamento: Joi.number().integer().positive().max(2147483647).required(),
  categorias: Joi.array().items(Joi.number().integer().positive().max(2147483647)).unique().optional(),
})
