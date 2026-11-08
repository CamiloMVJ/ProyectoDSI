import Joi from 'joi'
import { usuarioSchema } from './usuario.dto.js'

export const administradorSchema = Joi.object({
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

    rol: Joi.string()
        .trim()
        .max(100)
        .default('Administrador')
});

// Crea el usuario y su perfil juntos. id_usuario lo genera PostgreSQL.
// El schema original se conserva para asociar un usuario existente.
export const createAdminUserSchema = usuarioSchema.keys({
  rol: administradorSchema.extract('rol')
}).unknown(false).required()
