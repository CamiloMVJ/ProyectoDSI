import Joi from "joi"

export const authorizeUploadSchema = Joi.object({
  kind: Joi.string().valid("image", "document").required(),
  size: Joi.number().integer().positive().max(10485760).required(),
  mime: Joi.string().valid("image/webp", "application/pdf").required(),
  context: Joi.object({
    type: Joi.string().valid("sandbox", "business-request").required(),
    requestId: Joi.when('type', { is: 'business-request', then: Joi.number().integer().positive().max(2147483647).required(), otherwise: Joi.forbidden() }),
    documentType: Joi.when('type', { is: 'business-request', then: Joi.string().valid('RUC', 'Permiso').required(), otherwise: Joi.forbidden() }),
    fileName: Joi.when('type', { is: 'business-request', then: Joi.string().trim().max(255).required(), otherwise: Joi.forbidden() }),
  }).required(),
}).unknown(false)

export const confirmUploadSchema = Joi.object({
  receipt: Joi.string().max(4096).required(),
}).unknown(false)

export const fileIdSchema = Joi.object({
  fileId: Joi.string().max(4096).required(),
}).unknown(false)
