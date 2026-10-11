import Joi from 'joi'
import { usuarioSchema } from './usuario.dto.js'

export const propietarioNegocioSchema = Joi.object({
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

    estado_verificacion: Joi.string()
        .max(50)
        .default('Pendiente')
});

// Crea el usuario y su perfil juntos. id_usuario lo genera PostgreSQL.
// El schema original se conserva para asociar un usuario existente.
export const createPropietarioUserSchema = usuarioSchema.keys({
  estado_verificacion: propietarioNegocioSchema.extract('estado_verificacion')
}).unknown(false).required()
