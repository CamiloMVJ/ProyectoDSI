import Joi from 'joi';

export const favoritoSchema = Joi.object({
    id_turista: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del turista debe ser un número.',
            'number.integer': 'El ID del turista debe ser un número entero.',
            'number.positive': 'El ID del turista debe ser positivo.',
            'any.required': 'El ID del turista es obligatorio.'
        }),

    id_lugar: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del lugar debe ser un número.',
            'number.integer': 'El ID del lugar debe ser un número entero.',
            'number.positive': 'El ID del lugar debe ser positivo.',
            'any.required': 'El ID del lugar es obligatorio.'
        })
});