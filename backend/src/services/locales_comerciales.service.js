import * as repository from '../repositories/locales_comerciales.repository.js'
import * as propietarios_negociosRepository from '../repositories/propietarios_negocios.repository.js'
import * as complejos_turisticosRepository from '../repositories/complejos_turisticos.repository.js'
import * as categoriasRepository from '../repositories/categorias.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord } from './service-utils.js'

const fields = ["codigo_ruc", "id_dueno", "id_complejo_padre", "es_independiente", "precio_minimo", "precio_maximo", "id_categoria"]
const updateFields = ["codigo_ruc", "id_dueno", "id_complejo_padre", "es_independiente", "precio_minimo", "precio_maximo", "id_categoria"]

async function checkRules(data, client) {
  await requireReference(propietarios_negociosRepository, data.id_dueno, 'El propietario', client)
  await requireReference(complejos_turisticosRepository, data.id_complejo_padre, 'El complejo', client)
  await requireReference(categoriasRepository, data.id_categoria, 'La categoría', client)
  if (data.precio_minimo != null && data.precio_maximo != null &&
      Number(data.precio_maximo) < Number(data.precio_minimo)) {
    throw new AppError('El precio máximo no puede ser menor que el precio mínimo', 400)
  }
}

export async function findAll() {
  return execute(() => repository.findAll())
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
