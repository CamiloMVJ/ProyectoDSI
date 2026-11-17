import * as repository from "../repositories/gestion_lugares.repository.js"
import * as departamentos from "../repositories/departamentos.repository.js"
import * as categorias from "../repositories/categorias.repository.js"
import * as administradores from "../repositories/administradores.repository.js"
import { AppError } from "../errors/app-error.js"
import {
  execute,
  parseId,
  requireReference,
  withTransaction,
} from "./service-utils.js"

export function findAll() {
  return execute(() => repository.findAll())
}

export function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const place = await repository.findOne(id)
    if (!place) throw new AppError("El lugar turístico no existe", 404)
    return place
  })
}

export function findAdministrators() {
  return execute(() => repository.findAdministrators())
}

export function save(id, data) {
  id = parseId(id)
  if (data.tipo === 'complejo' && data.cobro_entrada && data.costo_entrada == null)
    throw new AppError('Indica el costo de entrada del complejo', 400)
  if (data.tipo === 'complejo' && !data.cobro_entrada && data.costo_entrada != null)
    throw new AppError('Un complejo con entrada gratuita no debe tener costo', 400)
  const horarioIds = data.horarios
    .map((horario) => horario.id_horario)
    .filter(Boolean)
  if (new Set(horarioIds).size !== horarioIds.length)
    throw new AppError("Hay horarios repetidos", 400)

  return execute(() =>
    withTransaction(async (client) => {
      if (!(await repository.lock(id, client)))
        throw new AppError("El lugar turístico no existe", 404)
      const current = await repository.findOne(id, client)
      if (current.tipo !== data.tipo)
        throw new AppError(
          "El subtipo del lugar no se puede cambiar desde esta edición",
          409,
        )
      await requireReference(
        departamentos,
        data.id_departamento,
        "El departamento",
        client,
      )
      if (data.id_administrador)
        await requireReference(
          administradores,
          data.id_administrador,
          "El administrador",
          client,
        )
      for (const categoryId of data.categorias) {
        await requireReference(categorias, categoryId, "La categoría", client)
      }
      const saved = await repository.save(id, data, client)
      if (!saved)
        throw new AppError("El subtipo o un horario ya no pertenece a este lugar", 409)
      return saved
    }),
  )
}
