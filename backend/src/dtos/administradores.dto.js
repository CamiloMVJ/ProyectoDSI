import Joi from 'joi';

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