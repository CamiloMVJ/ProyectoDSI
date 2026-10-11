import Joi from 'joi';

export const usuarioSchema = Joi.object({
nombre_completo: Joi.string()
.trim()
.min(3)
.max(150)
.required()
.messages({
'string.empty': 'El nombre completo es obligatorio.',
'string.min': 'El nombre debe tener al menos 3 caracteres.',
'string.max': 'El nombre no puede superar los 150 caracteres.',
'any.required': 'El nombre completo es obligatorio.'
}),

email: Joi.string()
    .email()
    .max(150)
    .required()
    .messages({
        'string.empty': 'El correo electrónico es obligatorio.',
        'string.email': 'Debe ingresar un correo electrónico válido.',
        'string.max': 'El correo no puede superar los 150 caracteres.',
        'any.required': 'El correo electrónico es obligatorio.'
    }),

password: Joi.string()
    .min(8)
    .max(100)
    .required()
    .messages({
        'string.empty': 'La contraseña es obligatoria.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña no puede superar los 100 caracteres.',
        'any.required': 'La contraseña es obligatoria.'
    }),

telefono: Joi.string()
    .max(30)
    .allow('', null)
    .optional()
    .messages({
        'string.max': 'El teléfono no puede superar los 30 caracteres.'
    })

});
