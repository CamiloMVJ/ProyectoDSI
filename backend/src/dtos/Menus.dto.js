import Joi from 'joi';

export const menuSchema = Joi.object({
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

    titulo_menu: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required()
        .messages({
            'string.empty': 'El título del menú es obligatorio.',
            'string.min': 'El título debe tener al menos 2 caracteres.',
            'string.max': 'El título no puede superar los 150 caracteres.',
            'any.required': 'El título del menú es obligatorio.'
        }),

    descripcion: Joi.string()
        .allow('', null)
        .optional(),

    esta_activo: Joi.boolean()
        .default(true)
});