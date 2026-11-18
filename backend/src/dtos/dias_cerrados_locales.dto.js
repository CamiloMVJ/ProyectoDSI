import Joi from "joi"

export const crearDiaCerradoSchema = Joi.object({
  fecha: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La fecha debe tener el formato YYYY-MM-DD.",
    }),
  motivo: Joi.string().trim().max(150).allow("", null).optional(),
}).unknown(false)
