import * as repository from '../repositories/solicitudes_registros.repository.js'
import * as departamentosRepository from '../repositories/departamentos.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, execute, requireReference } from './service-utils.js'

const fields = ['nombre_negocio', 'codigo_ruc', 'descripcion', 'municipio', 'direccion_exacta', 'id_departamento']

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
export async function create(data, idUsuario) {
  data = allowedData(data, fields)
  return execute(async () => {
    await requireReference(departamentosRepository, data.id_departamento, 'El departamento')
    return repository.create({ ...data, id_usuario: parseId(idUsuario) })
  })
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, ['estado'])
  return execute(async () => {
    const result = await repository.update(id, data)
    if (!result) throw new AppError('La solicitud no existe', 404)
    return result
  })
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('La solicitud no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
