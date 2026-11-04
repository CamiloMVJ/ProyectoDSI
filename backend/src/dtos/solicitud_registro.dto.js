import Joi from 'joi';

export const solicitudRegistroSchema = Joi.object({
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

    id_administrador: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional(),

    documentos_adjuntos: Joi.string()
        .allow('', null)
        .optional(),

    estado: Joi.string()
        .max(50)
        .default('Pendiente'),

    observaciones: Joi.string()
        .allow('', null)
        .optional()
});