import Joi from 'joi';

export const favoritoSchema = Joi.object({
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

    id_local: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del local debe ser un número.',
            'number.integer': 'El ID del local debe ser un número entero.',
            'number.positive': 'El ID del local debe ser positivo.',
            'any.required': 'El ID del local es obligatorio.'
        })
});
