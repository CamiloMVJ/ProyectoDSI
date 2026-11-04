import * as repository from '../repositories/horarios.repository.js'
import * as lugares_turisticosRepository from '../repositories/lugares_turisticos.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord } from './service-utils.js'

const fields = ["id_lugar", "dia_semama", "hora_apertura", "hora_cierre", "es_feriado"]
const updateFields = ["id_lugar", "dia_semama", "hora_apertura", "hora_cierre", "es_feriado"]

async function checkRules(data, client) {
  await requireReference(lugares_turisticosRepository, data.id_lugar, 'El lugar', client)
}

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El horario no existe', 404)
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
    'horarios', id, repository, 'El horario', async (current, client) => {
      // Validar referencias y reglas con los valores que quedarán guardados.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('El horario no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El horario no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
