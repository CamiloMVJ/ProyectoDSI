import Joi from 'joi';

export const servicioSchema = Joi.object({
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

nombre_servicio: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
        'string.empty': 'El nombre del servicio es obligatorio.',
        'string.min': 'El nombre debe tener al menos 2 caracteres.',
        'string.max': 'El nombre no puede superar los 150 caracteres.',
        'any.required': 'El nombre del servicio es obligatorio.'
    }),

descripcion: Joi.string()
    .allow('', null)
    .optional(),

precio: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
        'number.base': 'El precio debe ser un número.',
        'number.min': 'El precio no puede ser negativo.',
        'any.required': 'El precio es obligatorio.'
    }),

moneda: Joi.string()
    .max(10)
    .default('NIO'),

tipo_cobro: Joi.string()
    .max(50)
    .allow('', null)
    .optional(),

incluye: Joi.string()
    .allow('', null)
    .optional(),

duracion_estimada: Joi.string()
    .max(50)
    .allow('', null)
    .optional(),

esta_disponible: Joi.boolean()
    .default(true)

});
