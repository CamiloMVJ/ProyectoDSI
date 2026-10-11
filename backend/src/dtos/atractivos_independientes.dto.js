import Joi from 'joi'
import { lugarSchema } from './lugar.dto.js'

export const atractivoIndependienteSchema = Joi.object({
    id_lugar: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del lugar debe ser un número.',
            'number.integer': 'El ID del lugar debe ser un número entero.',
            'number.positive': 'El ID del lugar debe ser positivo.',
            'any.required': 'El ID del lugar es obligatorio.'
        }),

    tipo_acceso: Joi.string()
        .max(100)
        .allow('', null)
        .optional(),

    entidad_encargada: Joi.string()
        .max(150)
        .allow('', null)
        .optional(),

    id_administrador: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional(),

    normativa_visitantes: Joi.string()
        .allow('', null)
        .optional()
});

// Crea el lugar y su tipo juntos. id_lugar lo genera PostgreSQL.
// El schema original se conserva para asociar un lugar existente.
export const createAtractivoLugarSchema = lugarSchema.keys({
  tipo_acceso: atractivoIndependienteSchema.extract('tipo_acceso'),
  entidad_encargada: atractivoIndependienteSchema.extract('entidad_encargada'),
  id_administrador: atractivoIndependienteSchema.extract('id_administrador'),
  normativa_visitantes: atractivoIndependienteSchema.extract('normativa_visitantes')
}).unknown(false).required()
