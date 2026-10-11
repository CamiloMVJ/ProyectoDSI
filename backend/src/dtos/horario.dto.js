import Joi from 'joi';

export const horarioSchema = Joi.object({
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

    dia_semama: Joi.string()
        .trim()
        .max(20)
        .required()
        .messages({
            'string.empty': 'El día de la semana es obligatorio.',
            'string.max': 'El día de la semana no puede superar los 20 caracteres.',
            'any.required': 'El día de la semana es obligatorio.'
        }),

    hora_apertura: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            'string.empty': 'La hora de apertura es obligatoria.',
            'string.pattern.base': 'La hora de apertura debe tener el formato HH:MM.',
            'any.required': 'La hora de apertura es obligatoria.'
        }),

    hora_cierre: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            'string.empty': 'La hora de cierre es obligatoria.',
            'string.pattern.base': 'La hora de cierre debe tener el formato HH:MM.',
            'any.required': 'La hora de cierre es obligatoria.'
        }),

    es_feriado: Joi.boolean()
        .default(false)
});