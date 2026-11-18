import * as repository from '../repositories/departamentos.repository.js'
import { AppError } from '../errors/app-error.js'
import { allowedData, execute, parseId, pick, withLockedRecord } from './service-utils.js'

const fields = ['nombre', 'tipo']

export function findAll() {
  return execute(() => repository.findAll())
}

export function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El departamento no existe', 404)
    return record
  })
}

export function create(data) {
  data = allowedData(data, fields)
  return execute(() => repository.create(data))
}

export function update(id, data) {
  id = parseId(id)
  data = allowedData(data, fields)
  return execute(() => withLockedRecord(
    'departamentos', id, repository, 'El departamento', async (current, client) => {
      const result = await repository.update(id, { ...pick(current, fields), ...data }, client)
      if (!result) throw new AppError('El departamento no existe', 404)
      return result
    }
  ))
}

export function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El departamento no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
