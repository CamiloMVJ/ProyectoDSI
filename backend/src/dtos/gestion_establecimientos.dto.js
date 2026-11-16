import Joi from 'joi'

export const saveEstablishmentSchema = Joi.object({
  nombre: Joi.string().trim().max(150).required(),
  codigo_ruc: Joi.string().trim().max(50).required(),
  razon_social: Joi.string().trim().max(150).allow('', null),
  descripcion: Joi.string().allow('', null),
  id_departamento: Joi.number().integer().positive().required(),
  municipio: Joi.string().trim().max(100).required(),
  direccion_exacta: Joi.string().trim().required(),
  maps_link: Joi.string().trim().max(255).allow('', null),
  telefono_contacto: Joi.string().trim().max(30).allow('', null),
  correo_contacto: Joi.string().trim().email().max(150).allow('', null),
  sitio_web: Joi.string().trim().max(255).allow('', null),
  es_independiente: Joi.boolean().required(),
  id_complejo_padre: Joi.when('es_independiente', { is: false, then: Joi.number().integer().positive().required(), otherwise: Joi.valid(null) }),
  esta_publicado: Joi.boolean().required(),
  servicios: Joi.array().items(Joi.object({
    id_servicio: Joi.number().integer().positive().optional(),
    nombre_servicio: Joi.string().trim().min(2).max(150).required(),
    precio: Joi.number().min(0).max(99999999.99).precision(2).required(),
    moneda: Joi.string().valid('NIO', 'USD').required(),
  })).required(),
}).unknown(false)
