import Joi from 'joi';

export const eventoSchema = Joi.object({
titulo: Joi.string()
.trim()
.min(3)
.max(150)
.required()
.messages({
'string.empty': 'El título del evento es obligatorio.',
'string.min': 'El título debe tener al menos 3 caracteres.',
'string.max': 'El título no puede superar los 150 caracteres.',
'any.required': 'El título del evento es obligatorio.'
}),


descripcion: Joi.string()
    .allow('', null)
    .optional(),

fecha_inicio: Joi.date()
    .iso()
    .required()
    .raw()
    .messages({
        'date.format': 'La fecha de inicio debe tener un formato válido.',
        'any.required': 'La fecha de inicio es obligatoria.'
    }),

fecha_fin: Joi.date()
    .iso()
    .min(Joi.ref('fecha_inicio'))
    .required()
    .raw()
    .messages({
        'date.format': 'La fecha de finalización debe tener un formato válido.',
        'date.min': 'La fecha de finalización no puede ser anterior a la fecha de inicio.',
        'any.required': 'La fecha de finalización es obligatoria.'
    }),

hora_inicio: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .allow('', null)
    .optional()
    .messages({
        'string.pattern.base': 'La hora de inicio debe tener el formato HH:MM.'
    }),

hora_fin: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .allow('', null)
    .optional()
    .messages({
        'string.pattern.base': 'La hora de finalización debe tener el formato HH:MM.'
    }),

departamento: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
        'string.empty': 'El departamento es obligatorio.',
        'string.max': 'El departamento no puede superar los 100 caracteres.',
        'any.required': 'El departamento es obligatorio.'
    }),

municipio: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
        'string.empty': 'El municipio es obligatorio.',
        'string.max': 'El municipio no puede superar los 100 caracteres.',
        'any.required': 'El municipio es obligatorio.'
    }),

direccion_referencia: Joi.string()
    .allow('', null)
    .optional(),

tipo_evento: Joi.string()
    .max(100)
    .allow('', null)
    .optional(),

costo_entrada: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .optional()
    .messages({
        'number.min': 'El costo de entrada no puede ser negativo.'
    }),

es_gratuito: Joi.boolean()
    .default(false),

es_anual_recurrente: Joi.boolean()
    .default(false),

id_lugar_asociado: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),

estado: Joi.string()
    .max(50)
    .default('Programado')

});
