import Joi from 'joi';

export const lugarSchema = Joi.object({
nombre: Joi.string()
.trim()
.min(2)
.max(150)
.required()
.messages({
'string.empty': 'El nombre del lugar es obligatorio.',
'string.min': 'El nombre debe tener al menos 2 caracteres.',
'string.max': 'El nombre no puede superar los 150 caracteres.',
'any.required': 'El nombre del lugar es obligatorio.'
}),


descripcion: Joi.string()
    .allow('', null)
    .optional(),

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

direccion_exacta: Joi.string()
    .allow('', null)
    .optional(),

maps_link: Joi.string()
    .uri()
    .max(255)
    .allow('', null)
    .optional()
    .messages({
        'string.uri': 'El enlace de Google Maps debe ser una URL válida.',
        'string.max': 'El enlace de Maps no puede superar los 255 caracteres.'
    })

});
