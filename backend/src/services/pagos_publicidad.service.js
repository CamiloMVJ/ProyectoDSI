import * as repository from '../repositories/pagos_publicitarios.repository.js'
import * as campanias_publicitariasRepository from '../repositories/campanias_publicitarias.repository.js'
import * as propietarios_negociosRepository from '../repositories/propietarios_negocios.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, checkDates, checkEvent, normalizeEvent, publicUser } from './service-utils.js'

const fields = ["id_campania", "id_dueno", "id_administrador", "monto", "moneda", "metodo_pago", "numero_referencia", "comprobante_url", "estado_pago"]

async function checkRules(data, client) {
  await requireReference(campanias_publicitariasRepository, data.id_campania, 'La campaña', client)
  await requireReference(propietarios_negociosRepository, data.id_dueno, 'El propietario', client)
  await requireReference(propietarios_negociosRepository, data.id_administrador, 'El propietario encargado', client)
}

export async function findAll() {
  return execute(async () => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El pago no existe', 404)
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
    'pagos_publicidad', id, repository, 'El pago', async (current, client) => {
      // Conservar los campos omitidos y comprobar reglas con el estado final.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('El pago no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El pago no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
