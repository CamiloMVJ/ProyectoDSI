import * as repository from '../repositories/servicios.repository.js'
import * as locales_comercialesRepository from '../repositories/locales_comerciales.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, checkDates, checkEvent, normalizeEvent, publicUser } from './service-utils.js'

const fields = ["id_local", "nombre_servicio", "descripcion", "precio", "moneda", "tipo_cobro", "incluye", "duracion_estimada", "esta_disponible"]

async function checkRules(data, client) {
  await requireReference(locales_comercialesRepository, data.id_local, 'El local', client)
}

export async function findAll() {
  return execute(async () => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El servicio no existe', 404)
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
    'servicios', id, repository, 'El servicio', async (current, client) => {
      // Conservar los campos omitidos y comprobar reglas con el estado final.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, data, client)
      if (!result) throw new AppError('El servicio no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El servicio no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
