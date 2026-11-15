import Joi from "joi"

export const authorizeUploadSchema = Joi.object({
  kind: Joi.string().valid("image", "document").required(),
  size: Joi.number().integer().positive().max(10485760).required(),
  mime: Joi.string().valid("image/webp", "application/pdf").required(),
  context: Joi.object({
    type: Joi.string().valid("sandbox").required(),
  }).required(),
}).unknown(false)

export const confirmUploadSchema = Joi.object({
  receipt: Joi.string().max(4096).required(),
}).unknown(false)

export const fileIdSchema = Joi.object({
  fileId: Joi.string().max(4096).required(),
}).unknown(false)
