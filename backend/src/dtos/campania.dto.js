import Joi from 'joi';

export const campaniaSchema = Joi.object({
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


fecha_inicio: Joi.date()
    .iso()
    .required()
    .messages({
        'date.format': 'La fecha de inicio debe tener un formato válido.',
        'any.required': 'La fecha de inicio es obligatoria.'
    }),

fecha_fin: Joi.date()
    .iso()
    .min(Joi.ref('fecha_inicio'))
    .required()
    .messages({
        'date.format': 'La fecha de finalización debe tener un formato válido.',
        'date.min': 'La fecha de finalización no puede ser anterior a la fecha de inicio.',
        'any.required': 'La fecha de finalización es obligatoria.'
    }),

monto_total: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
        'number.base': 'El monto total debe ser un número.',
        'number.min': 'El monto total no puede ser negativo.',
        'any.required': 'El monto total es obligatorio.'
    }),

moneda: Joi.string()
    .max(10)
    .default('NIO'),

estado: Joi.string()
    .max(50)
    .default('Activa')

});
