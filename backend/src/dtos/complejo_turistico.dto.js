import Joi from 'joi';

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