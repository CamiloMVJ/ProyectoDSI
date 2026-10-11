import Joi from 'joi'
import { lugarSchema } from './lugar.dto.js'

export const complejoTuristicoSchema = Joi.object({
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

    capacidad_locales: Joi.number()
        .integer()
        .min(0)
        .allow(null)
        .optional()
        .messages({
            'number.integer': 'La capacidad de locales debe ser un número entero.',
            'number.min': 'La capacidad de locales no puede ser negativa.'
        }),

    cobro_entrada: Joi.boolean()
        .default(false),

    id_administrador: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional(),

    costo_entrada: Joi.number()
        .min(0)
        .precision(2)
        .allow(null)
        .optional()
        .messages({
            'number.min': 'El costo de entrada no puede ser negativo.'
        })
});

// Crea el lugar y su tipo juntos. id_lugar lo genera PostgreSQL.
// El schema original se conserva para asociar un lugar existente.
export const createComplejoLugarSchema = lugarSchema.keys({
  capacidad_locales: complejoTuristicoSchema.extract('capacidad_locales'),
  cobro_entrada: complejoTuristicoSchema.extract('cobro_entrada'),
  id_administrador: complejoTuristicoSchema.extract('id_administrador'),
  costo_entrada: complejoTuristicoSchema.extract('costo_entrada')
}).unknown(false).required()
