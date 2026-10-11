import * as repository from '../repositories/administradores.repository.js'
import * as usuariosRepository from '../repositories/usuarios.repository.js'
import { hashPassword } from './password-utils.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, publicUser, withTransaction } from './service-utils.js'

const fields = ["id_usuario", "rol"]
const updateFields = ["id_usuario", "rol"]

async function checkRules(data, client) {
  await requireReference(usuariosRepository, data.id_usuario, 'El usuario', client)
}

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('El administrador no existe', 404)
    return record
  })
}

// El middleware debe validar el DTO de creación antes de llamar a esta función.
export async function create(data, client) {
  data = allowedData(data, fields)
  return execute(async () => {
    await checkRules(data, client)
    return repository.create(data, client)
  })
}

const userFields = ['nombre_completo', 'email', 'password', 'telefono']
const profileFields = ['rol']

// Validar previamente con createAdminUserSchema. No recibe id_usuario.
// El hash se calcula antes de abrir la transacción.
export async function createAdminUser(data) {
  data = allowedData(data, [...userFields, ...profileFields])
  const userData = pick(data, userFields)
  userData.password_hash = await hashPassword(userData.password)
  delete userData.password

  return execute(() => withTransaction(async (client) => {
    const usuario = await usuariosRepository.create(userData, client)
    const administrador = await create({
      ...pick(data, profileFields),
      id_usuario: usuario.id_usuario
    }, client)

    return { usuario: publicUser(usuario), administrador }
  }))
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, updateFields)
  return execute(() => withLockedRecord(
    'administradores', id, repository, 'El administrador', async (current, client) => {
      // Validar referencias y reglas con los valores que quedarán guardados.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('El administrador no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('El administrador no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
