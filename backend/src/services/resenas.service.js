import * as repository from '../repositories/resenas.repository.js'
import * as usuariosRepository from '../repositories/usuarios.repository.js'
import * as localesRepository from '../repositories/locales.repository.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, pick, execute, requireReference, withLockedRecord, checkDates, checkEvent, normalizeEvent, publicUser } from './service-utils.js'

const fields = ["id_usuario", "id_local", "calificacion", "comentario", "respuesta_propietario", "estado_moderacion"]

async function checkRules(data, client) {
  await requireReference(usuariosRepository, data.id_usuario, 'El usuario', client)
  await requireReference(localesRepository, data.id_local, 'El local', client)
}

export async function findAll() {
  return execute(async () => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('La reseña no existe', 404)
    return record
  })
}

export function findPublicByLocal(idLocal) {
  idLocal = parseId(idLocal)
  return execute(() => repository.findPublicByLocal(idLocal))
}

// Recibe datos ya validados por Joi (middleware validar).
export async function create(data, user) {
  const userId = parseId(user.id)
  const localId = parseId(data.id_local)
  return execute(async () => {
    if (!await repository.findCommercialLocal(localId)) throw new AppError('El negocio no está disponible para reseñas', 404)
    if (await repository.isOwnerOfLocal(localId, userId)) throw new AppError('No podés reseñar tu propio negocio', 403)
    return repository.create(data, userId)
  })
}

export function permissions(idLocal, userId) {
  idLocal = parseId(idLocal)
  userId = parseId(userId)
  return execute(async () => ({ puede_responder: await repository.isOwnerOfLocal(idLocal, userId) }))
}

export function reply(id, data, user) {
  id = parseId(id)
  const userId = parseId(user.id)
  return execute(async () => {
    const result = await repository.reply(id, userId, data.respuesta_propietario)
    if (!result) throw new AppError('La reseña no existe o no pertenece a tu negocio', 404)
    return result
  })
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, fields)
  
  return execute(() => withLockedRecord(
    'resenas', id, repository, 'La reseña', async (current, client) => {
      // Conservar los campos omitidos y comprobar reglas con el estado final.
      const merged = { ...pick(current, fields), ...data }
      await checkRules(merged, client)
      const result = await repository.update(id, merged, client)
      if (!result) throw new AppError('La reseña no existe', 404)
      return result
    }
  ))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('La reseña no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
