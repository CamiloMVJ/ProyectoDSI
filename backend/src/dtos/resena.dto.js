import Joi from 'joi';

export const resenaSchema = Joi.object({
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
    }),

calificacion: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
        'number.base': 'La calificación debe ser un número.',
        'number.integer': 'La calificación debe ser un número entero.',
        'number.min': 'La calificación mínima es 1.',
        'number.max': 'La calificación máxima es 5.',
        'any.required': 'La calificación es obligatoria.'
    }),

comentario: Joi.string()
    .allow('', null)
    .optional(),

respuesta_propietario: Joi.string()
    .allow('', null)
    .optional(),

estado_moderacion: Joi.string()
    .max(50)
    .default('Pendiente')

});
