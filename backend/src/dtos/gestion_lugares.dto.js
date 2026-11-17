import Joi from "joi"

const optionalText = (max) => Joi.string().trim().max(max).allow("", null)
const positiveId = Joi.number().integer().positive().max(2147483647)

export const savePlaceSchema = Joi.object({
  tipo: Joi.string().valid("complejo", "atractivo", "otro").required(),
  nombre: Joi.string().trim().min(2).max(150).required(),
  descripcion: Joi.string().allow("", null).required(),
  id_departamento: positiveId.required(),
  municipio: Joi.string().trim().min(1).max(100).required(),
  direccion_exacta: Joi.string().trim().allow("", null).required(),
  maps_link: optionalText(255).uri().required(),
  telefono_contacto: optionalText(30).required(),
  correo_contacto: optionalText(150).email().required(),
  sitio_web: optionalText(255).required(),
  capacidad_locales: Joi.when("tipo", {
    is: "complejo",
    then: Joi.number().integer().min(0).max(2147483647).allow(null).required(),
    otherwise: Joi.forbidden(),
  }),
  cobro_entrada: Joi.when("tipo", {
    is: "complejo",
    then: Joi.boolean().required(),
    otherwise: Joi.forbidden(),
  }),
  costo_entrada: Joi.when("tipo", {
    is: "complejo",
    then: Joi.number()
      .min(0)
      .max(99999999.99)
      .precision(2)
      .allow(null)
      .required(),
    otherwise: Joi.forbidden(),
  }),
  tipo_acceso: Joi.when("tipo", {
    is: "atractivo",
    then: optionalText(100).required(),
    otherwise: Joi.forbidden(),
  }),
  entidad_encargada: Joi.when("tipo", {
    is: "atractivo",
    then: optionalText(150).required(),
    otherwise: Joi.forbidden(),
  }),
  normativa_visitantes: Joi.when("tipo", {
    is: "atractivo",
    then: Joi.string().allow("", null).required(),
    otherwise: Joi.forbidden(),
  }),
  id_administrador: Joi.when("tipo", {
    is: Joi.valid("complejo", "atractivo"),
    then: positiveId.allow(null).required(),
    otherwise: Joi.forbidden(),
  }),
  horarios: Joi.array()
    .items(
      Joi.object({
        id_horario: positiveId.optional(),
        dia_semana: Joi.string().trim().min(1).max(20).required(),
        hora_apertura: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .required(),
        hora_cierre: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .required(),
        es_feriado: Joi.boolean().required(),
      }),
    )
    .required(),
  categorias: Joi.array().items(positiveId).unique().required(),
}).unknown(false)
