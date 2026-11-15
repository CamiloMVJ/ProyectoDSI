import Joi from 'joi';

export const imagenLugarSchema = Joi.object({
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

    url_imagen: Joi.string()
        .uri()
        .max(255)
        .required()
        .messages({
            'string.empty': 'La URL de la imagen es obligatoria.',
            'string.uri': 'La URL de la imagen debe ser válida.',
            'string.max': 'La URL de la imagen no puede superar los 255 caracteres.',
            'any.required': 'La URL de la imagen es obligatoria.'
        }),

    descripcion: Joi.string()
        .allow('', null)
        .optional()
});
