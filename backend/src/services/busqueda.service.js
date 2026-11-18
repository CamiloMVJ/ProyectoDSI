import Joi from 'joi'
import * as repository from '../repositories/busqueda.repository.js'
import { AppError } from '../errors/app-error.js'
import { execute } from './service-utils.js'

const schema = Joi.object({
  q: Joi.string().trim().max(150).allow('').default(''),
  departamento: Joi.number().integer().positive().max(2147483647).empty('').default(null),
  municipio: Joi.string().trim().max(100).allow('').default(''),
  tipo: Joi.string().valid('todos', 'complejo', 'atractivo', 'otro', 'local').default('todos'),
  orden: Joi.string().valid('nombre-asc', 'nombre-desc', 'recientes').default('nombre-asc'),
  max_budget: Joi.number().min(0).precision(2).empty('').default(null),
  id_categoria: Joi.number().integer().positive().max(2147483647).empty('').default(null),
  page: Joi.number().integer().min(1).max(100000).default(1),
  limit: Joi.number().integer().min(1).max(50).default(8),
}).unknown(false)

export function search(params) {
  const { error, value } = schema.validate(params)
  if (error) throw new AppError('Los filtros de búsqueda no son válidos', 400)
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return execute(() => repository.search({ ...value, q: normalize(value.q), municipio: normalize(value.municipio) }))
}
