import * as repository from '../repositories/usuarios.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, checkDates, checkEvent, normalizeEvent, publicUser } from './service-utils.js'
import { hashPassword } from './password-utils.js'

const fields = ["nombre_completo", "email", "password", "telefono"]

async function prepare(data) {
  const result = { ...data }
  if (Object.hasOwn(result, 'password')) {
    result.password_hash = await hashPassword(result.password)
    delete result.password
  }
  return result
}

export async function findAll() {
  return execute(async () => (await repository.findAll()).map(publicUser))
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El usuario no existe', 404)
    return publicUser(record)
  })
}

// Recibe datos ya validados por Joi (middleware validar).
export async function create(data) {
  data = allowedData(data, fields)

  return execute(async () => {
    // console.log("Data preparada: ", await prepare(data))
    const result = await repository.create(await prepare(data))
    
    return publicUser(result)
  })
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, fields)

  return execute(() => withLockedRecord(
    'usuarios', id, repository, 'El usuario', async (current, client) => {
      const result = await repository.update(id, await prepare(data), client)
      if (!result) throw new AppError('El usuario no existe', 404)
      return publicUser(result)
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El usuario no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
