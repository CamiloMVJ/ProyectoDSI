import * as repository from '../repositories/gestion_establecimientos.repository.js'
import * as departamentos from '../repositories/departamentos.repository.js'
import * as complejos from '../repositories/complejos_turisticos.repository.js'
import { AppError } from '../errors/app-error.js'
import { execute, parseId, requireReference, withTransaction } from './service-utils.js'

export function findAll(user) {
  return execute(() => repository.findAll(user.id, user.rol === 'Administrador'))
}

export function save(id, data, user) {
  id = parseId(id)
  return execute(() => withTransaction(async client => {
    if (!await repository.lock(id, user.id, user.rol === 'Administrador', client)) throw new AppError('El establecimiento no existe', 404)
    await requireReference(departamentos, data.id_departamento, 'El departamento', client)
    if (!data.es_independiente) await requireReference(complejos, data.id_complejo_padre, 'El complejo', client)
    const result = await repository.save(id, data, client)
    if (!result) throw new AppError('Uno de los servicios ya no pertenece a este establecimiento', 409)
    return result
  }))
}
