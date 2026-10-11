import Joi from 'joi';

export const pagoSchema = Joi.object({
id_campania: Joi.number()
.integer()
.positive()
.required()
.messages({
'number.base': 'El ID de la campaña debe ser un número.',
'number.integer': 'El ID de la campaña debe ser un número entero.',
'number.positive': 'El ID de la campaña debe ser positivo.',
'any.required': 'El ID de la campaña es obligatorio.'
}),


id_dueno: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),

id_administrador: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),

monto: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
        'number.base': 'El monto debe ser un número.',
        'number.min': 'El monto no puede ser negativo.',
        'any.required': 'El monto es obligatorio.'
    }),

moneda: Joi.string()
    .max(10)
    .default('NIO'),

metodo_pago: Joi.string()
    .max(50)
    .allow('', null)
    .optional(),

numero_referencia: Joi.string()
    .max(100)
    .allow('', null)
    .optional(),

comprobante_url: Joi.string()
    .uri()
    .max(255)
    .allow('', null)
    .optional()
    .messages({
        'string.uri': 'El comprobante debe contener una URL válida.',
        'string.max': 'La URL del comprobante no puede superar los 255 caracteres.'
    }),

estado_pago: Joi.string()
    .max(50)
    .default('Pendiente')

});
