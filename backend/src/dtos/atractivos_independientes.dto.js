import Joi from 'joi';

export const atractivoIndependienteSchema = Joi.object({
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

    tipo_acceso: Joi.string()
        .max(100)
        .allow('', null)
        .optional(),

    entidad_encargada: Joi.string()
        .max(150)
        .allow('', null)
        .optional(),

    id_administrador: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional(),

    normativa_visitantes: Joi.string()
        .allow('', null)
        .optional()
});