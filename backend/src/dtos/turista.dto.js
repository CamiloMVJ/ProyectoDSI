import Joi from 'joi'
import { usuarioSchema } from './usuario.dto.js'

export const turistaSchema = Joi.object({
    id_usuario: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del usuario debe ser un número.',
            'number.integer': 'El ID del usuario debe ser un número entero.',
            'number.positive': 'El ID del usuario debe ser positivo.',
            'any.required': 'El ID del usuario es obligatorio.'
        }),

    pais_origen: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.empty': 'El país de origen es obligatorio.',
            'string.max': 'El país de origen no puede superar los 100 caracteres.',
            'any.required': 'El país de origen es obligatorio.'
        })
});

// Crea el usuario y su perfil juntos. id_usuario lo genera PostgreSQL.
// El schema original se conserva para asociar un usuario existente.
export const createTuristaUserSchema = usuarioSchema.keys({
  pais_origen: turistaSchema.extract('pais_origen')
}).unknown(false).required()
