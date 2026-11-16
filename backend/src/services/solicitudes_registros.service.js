import * as repository from '../repositories/solicitudes_registros.repository.js'
import * as departamentosRepository from '../repositories/departamentos.repository.js'
import { signedRequestDocument } from '../storage/uploads.service.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, execute, requireReference, withTransaction } from './service-utils.js'

const fields = ['nombre_negocio', 'codigo_ruc', 'descripcion', 'municipio', 'direccion_exacta', 'id_departamento']

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findMine(idUsuario) {
  idUsuario = parseId(idUsuario)
  return execute(() => repository.findByUser(idUsuario))
}

export async function getMyDocument(user, requestId, documentId) {
  requestId = parseId(requestId)
  documentId = parseId(documentId)
  return execute(() => signedRequestDocument(user, requestId, documentId))
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
  idUsuario = parseId(idUsuario)
  return execute(async () => {
    await requireReference(departamentosRepository, data.id_departamento, 'El departamento')
    return withTransaction(async (client) => {
      await repository.lockRuc(data.codigo_ruc, client)
      if (await repository.existsApprovedLocalWithRuc(data.codigo_ruc, client))
        throw new AppError('Ya existe un local registrado con este RUC', 409)
      if (await repository.existsPendingWithRuc(data.codigo_ruc, client))
        throw new AppError('Ya existe una solicitud pendiente con este RUC', 409)
      return repository.create({ ...data, id_usuario: idUsuario }, client)
    })
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
