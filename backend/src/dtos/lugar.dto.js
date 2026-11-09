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

id_departamento: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
        'number.base': 'El ID del departamento debe ser un número.',
        'number.integer': 'El ID del departamento debe ser un entero.',
        'number.positive': 'El ID del departamento debe ser positivo.',
        'any.required': 'El ID del departamento es obligatorio.'
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

export const buscarLugaresSchema = Joi.object({
    q: Joi.string().trim().max(150).allow('').default(''),
    departamento: Joi.number().integer().positive().empty('').default(null),
    municipio: Joi.string().trim().max(100).allow('').default(''),
    tipo: Joi.string().valid('todos', 'complejo', 'atractivo', 'otro').default('todos'),
    orden: Joi.string().valid('nombre-asc', 'nombre-desc', 'recientes').default('nombre-asc')
}).unknown(false);
