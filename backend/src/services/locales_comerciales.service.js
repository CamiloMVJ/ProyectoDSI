import * as repository from '../repositories/locales_comerciales.repository.js'
import * as propietarios_negociosRepository from '../repositories/propietarios_negocios.repository.js'
import * as complejos_turisticosRepository from '../repositories/complejos_turisticos.repository.js'
import * as categoriasRepository from '../repositories/categorias.repository.js'
import { AppError } from '../errors/app-error.js'
import Joi from 'joi'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord } from './service-utils.js'

const fields = ["codigo_ruc", "id_dueno", "id_complejo_padre", "es_independiente", "id_categoria"]
const updateFields = fields
const budgetFilterSchema = Joi.object({ max_budget: Joi.number().min(0).precision(2) }).unknown(false)

async function checkRules(data, client) {
  await requireReference(propietarios_negociosRepository, data.id_dueno, 'El propietario', client)
  await requireReference(complejos_turisticosRepository, data.id_complejo_padre, 'El complejo', client)
  await requireReference(categoriasRepository, data.id_categoria, 'La categoría', client)
}

export async function findAll(params = {}) {
  const { error, value } = budgetFilterSchema.validate(params)
  if (error) throw new AppError('El presupuesto máximo no es válido', 400)
  return execute(() => repository.findAll(value.max_budget ?? null))
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El local no existe', 404)
    return record
  })
}

// El middleware debe validar el DTO de creación antes de llamar a esta función.
export async function create(data) {
  data = allowedData(data, fields)
  return execute(async () => {
    await checkRules(data)
    return repository.create(data)
  })
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, updateFields)
  return execute(() => withLockedRecord(
    'locales_comerciales', id, repository, 'El local', async (current, client) => {
      // Validar referencias y reglas con los valores que quedarán guardados.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, data, client)
      if (!result) throw new AppError('El local no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El local no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
