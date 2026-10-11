import Joi from 'joi';

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