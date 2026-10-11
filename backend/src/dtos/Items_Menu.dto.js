import Joi from 'joi';

export const itemMenuSchema = Joi.object({
id_menu: Joi.number()
.integer()
.positive()
.required()
.messages({
'number.base': 'El ID del menú debe ser un número.',
'number.integer': 'El ID del menú debe ser un número entero.',
'number.positive': 'El ID del menú debe ser positivo.',
'any.required': 'El ID del menú es obligatorio.'
}),


nombre_platillo: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
        'string.empty': 'El nombre del platillo es obligatorio.',
        'string.min': 'El nombre debe tener al menos 2 caracteres.',
        'string.max': 'El nombre no puede superar los 150 caracteres.',
        'any.required': 'El nombre del platillo es obligatorio.'
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

url_foto: Joi.string()
    .uri()
    .max(255)
    .allow('', null)
    .optional()
    .messages({
        'string.uri': 'La URL de la foto debe ser válida.',
        'string.max': 'La URL de la foto no puede superar los 255 caracteres.'
    }),

es_vegetariano: Joi.boolean()
    .default(false),

esta_disponible: Joi.boolean()
    .default(true)


});
