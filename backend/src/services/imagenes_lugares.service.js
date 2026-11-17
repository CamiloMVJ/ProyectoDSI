import * as repository from "../repositories/imagenes_lugares.repository.js"
import * as localesRepository from "../repositories/locales.repository.js"
import * as managedLocals from "../repositories/managed-locals.repository.js"
import { AppError } from "../errors/app-error.js"
import {
  parseId,
  allowedData,
  pick,
  execute,
  requireReference,
  withLockedRecord,
} from "./service-utils.js"

const fields = ["id_local", "url_imagen", "descripcion"]
const updateFields = fields

async function checkRules(data, user, client) {
  await requireReference(localesRepository, data.id_local, "El local", client)
  if (
    !(await managedLocals.findManagedLocal(
      data.id_local,
      user.id,
      user.rol === "Administrador",
      client,
    ))
  )
    throw new AppError(
      "No tenés permiso para gestionar las imágenes de este local",
      403,
    )
}

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError("La imagen no existe", 404)
    return record
  })
}

// El middleware debe validar el DTO de creación antes de llamar a esta función.
export async function create(data, user) {
  data = allowedData(data, fields)
  return execute(async () => {
    await checkRules(data, user)
    return repository.create(data)
  })
}

export async function update(id, data, user) {
  id = parseId(id)
  data = allowedData(data, updateFields)
  return execute(() =>
    withLockedRecord(
      "imagenes_locales",
      id,
      repository,
      "La imagen",
      async (current, client) => {
        // Validar referencias y reglas con los valores que quedarán guardados.
        const merged = { ...pick(current, fields), ...data }
        await checkRules(current, user, client)
        await checkRules(merged, user, client)
        const result = await repository.update(id, merged, client)
        if (!result) throw new AppError("La imagen no existe", 404)
        return result
      },
    ),
  )
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError("La imagen no existe", 404)
    return { mensaje: "Registro eliminado correctamente", id }
  })
}
