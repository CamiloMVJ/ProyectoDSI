import Joi from 'joi';

export const resenaSchema = Joi.object({
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
