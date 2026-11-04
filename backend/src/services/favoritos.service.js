import * as repository from '../repositories/favoritos.repository.js'
import * as turistasRepository from '../repositories/turistas.repository.js'
import * as lugares_turisticosRepository from '../repositories/lugares_turisticos.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord } from './service-utils.js'

const fields = ["id_turista", "id_lugar"]
const updateFields = ["id_turista", "id_lugar"]

async function checkRules(data, client) {
  await requireReference(turistasRepository, data.id_turista, 'El turista', client)
  await requireReference(lugares_turisticosRepository, data.id_lugar, 'El lugar', client)
}

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El favorito no existe', 404)
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
    'favoritos', id, repository, 'El favorito', async (current, client) => {
      // Validar referencias y reglas con los valores que quedarán guardados.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('El favorito no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El favorito no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
