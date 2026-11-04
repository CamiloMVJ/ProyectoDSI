import Joi from 'joi';

export const categoriaSchema = Joi.object({
    nombre: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'El nombre de la categoría es obligatorio.',
            'string.min': 'El nombre debe tener al menos 2 caracteres.',
            'string.max': 'El nombre no puede superar los 100 caracteres.',
            'any.required': 'El nombre de la categoría es obligatorio.'
        }),

    descripcion: Joi.string()
        .allow('', null)
        .optional(),

    icono_url: Joi.string()
        .max(255)
        .allow('', null)
        .optional()
});