import * as repository from '../repositories/eventos_nacionales.repository.js'
import * as lugares_turisticosRepository from '../repositories/lugares_turisticos.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, checkDates, checkEvent, normalizeEvent, publicUser } from './service-utils.js'

const fields = ["titulo", "descripcion", "fecha_inicio", "fecha_fin", "hora_inicio", "hora_fin", "departamento", "municipio", "direccion_referencia", "tipo_evento", "costo_entrada", "es_gratuito", "es_anual_recurrente", "id_lugar_asociado", "estado"]

async function checkRules(data, client) {
  await requireReference(lugares_turisticosRepository, data.id_lugar_asociado, 'El lugar asociado', client)
  checkEvent(data)
}

export async function findAll() {
  return execute(async () => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El evento no existe', 404)
    return record
  })
}

// Recibe datos ya validados por Joi (middleware validar).
export async function create(data) {
  data = allowedData(data, fields)
  data = normalizeEvent(data)
  return execute(async () => {
    await checkRules(data)
    const result = await repository.create(data)
    return result
  })
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, fields)
  data = normalizeEvent(data)
  return execute(() => withLockedRecord(
    'eventos_nacionales', id, repository, 'El evento', async (current, client) => {
      // Conservar los campos omitidos y comprobar reglas con el estado final.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('El evento no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El evento no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
