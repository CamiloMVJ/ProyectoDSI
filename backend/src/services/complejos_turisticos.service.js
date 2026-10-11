import * as repository from '../repositories/complejos_turisticos.repository.js'
import * as lugares_turisticosRepository from '../repositories/lugares_turisticos.repository.js'
import * as propietarios_negociosRepository from '../repositories/propietarios_negocios.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, withTransaction } from './service-utils.js'

const fields = ["id_lugar", "capacidad_locales", "cobro_entrada", "id_administrador", "costo_entrada"]
const updateFields = ["capacidad_locales", "cobro_entrada", "id_administrador", "costo_entrada"]

async function checkRules(data, client) {
  await requireReference(lugares_turisticosRepository, data.id_lugar, 'El lugar', client)
  await requireReference(propietarios_negociosRepository, data.id_administrador, 'El propietario encargado', client)
}

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El complejo no existe', 404)
    return record
  })
}

// El middleware debe validar el DTO de creación antes de llamar a esta función.
export async function create(data, client) {
  data = allowedData(data, fields)
  return execute(async () => {
    await checkRules(data, client)
    if (await repository.findOne(data.id_lugar, client)) {
      throw new AppError('Ese lugar ya tiene un registro en complejos_turisticos', 409)
    }
    return repository.create(data, client)
  })
}

const lugarFields = [
  'nombre', 'descripcion', 'departamento', 'municipio',
  'direccion_exacta', 'maps_link'
]

// Validar previamente con createComplejoLugarSchema. No recibe id_lugar.
// id_administrador sigue siendo un propietario existente, según el SQL.
export async function createComplejoLugar(data) {
  data = allowedData(data, [...lugarFields, ...updateFields])

  return execute(() => withTransaction(async (client) => {
    const lugar = await lugares_turisticosRepository.create(
      pick(data, lugarFields), client
    )
    const complejo = await create({
      ...pick(data, updateFields),
      id_lugar: lugar.id_lugar
    }, client)

    return { lugar, complejo }
  }))
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, updateFields)
  return execute(() => withLockedRecord(
    'complejos_turisticos', id, repository, 'El complejo', async (current, client) => {
      // Validar referencias y reglas con los valores que quedarán guardados.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('El complejo no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El complejo no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}