import * as repository from '../repositories/resenas.repository.js'
import * as turistasRepository from '../repositories/turistas.repository.js'
import * as lugares_turisticosRepository from '../repositories/lugares_turisticos.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, checkDates, checkEvent, normalizeEvent, publicUser } from './service-utils.js'

const fields = ["id_turista", "id_lugar", "calificacion", "comentario", "respuesta_propietario", "estado_moderacion"]

async function checkRules(data, client) {
  await requireReference(turistasRepository, data.id_turista, 'El turista', client)
  await requireReference(lugares_turisticosRepository, data.id_lugar, 'El lugar', client)
}

export async function findAll() {
  return execute(async () => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('La reseña no existe', 404)
    return record
  })
}

// Recibe datos ya validados por Joi (middleware validar).
export async function create(data) {
  data = allowedData(data, fields)
  
  return execute(async () => {
    await checkRules(data)
    const result = await repository.create(data)
    return result
  })
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, fields)
  
  return execute(() => withLockedRecord(
    'resenas', id, repository, 'La reseña', async (current, client) => {
      // Conservar los campos omitidos y comprobar reglas con el estado final.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('La reseña no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('La reseña no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
