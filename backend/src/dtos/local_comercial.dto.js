import Joi from 'joi';

export const localComercialSchema = Joi.object({
    codigo_ruc: Joi.string()
        .trim()
        .max(50)
        .required()
        .messages({
            'string.empty': 'El código RUC es obligatorio.',
            'string.max': 'El código RUC no puede superar los 50 caracteres.',
            'any.required': 'El código RUC es obligatorio.'
        }),

    id_dueno: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del dueño debe ser un número.',
            'number.integer': 'El ID del dueño debe ser un número entero.',
            'number.positive': 'El ID del dueño debe ser positivo.',
            'any.required': 'El ID del dueño es obligatorio.'
        }),

    id_complejo_padre: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional(),

    es_independiente: Joi.boolean()
        .default(true),

    precio_minimo: Joi.number()
        .min(0)
        .precision(2)
        .allow(null)
        .optional()
        .messages({
            'number.min': 'El precio mínimo no puede ser negativo.'
        }),

    precio_maximo: Joi.number()
        .min(0)
        .precision(2)
        .allow(null)
        .optional()
        .messages({
            'number.min': 'El precio máximo no puede ser negativo.'
        }),

    id_categoria: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional()
});