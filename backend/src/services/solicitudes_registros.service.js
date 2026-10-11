import * as repository from '../repositories/solicitudes_registros.repository.js'
import * as propietarios_negociosRepository from '../repositories/propietarios_negocios.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord } from './service-utils.js'

const fields = ["id_dueno", "id_administrador", "documentos_adjuntos", "estado", "observaciones"]
const updateFields = ["id_dueno", "id_administrador", "documentos_adjuntos", "estado", "observaciones"]

async function checkRules(data, client) {
  await requireReference(propietarios_negociosRepository, data.id_dueno, 'El propietario', client)
  await requireReference(propietarios_negociosRepository, data.id_administrador, 'El propietario encargado', client)
}

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('La solicitud no existe', 404)
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
    'solicitudes_registros', id, repository, 'La solicitud', async (current, client) => {
      // Validar referencias y reglas con los valores que quedarán guardados.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, data, client)
      if (!result) throw new AppError('La solicitud no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('La solicitud no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
