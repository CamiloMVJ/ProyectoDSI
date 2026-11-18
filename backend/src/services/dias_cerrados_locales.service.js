import * as repository from "../repositories/dias_cerrados_locales.repository.js"
import { AppError } from "../errors/app-error.js"
import { execute, parseId, withTransaction } from "./service-utils.js"

const fechaValida = (fecha) => {
  const [year, month, day] = fecha.split("-").map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  )
}

export function findAll(idLocal, user) {
  idLocal = parseId(idLocal)
  return execute(async () => {
    if (
      !(await repository.findManagedLocal(
        idLocal,
        user.id,
        user.rol === "Administrador",
      ))
    )
      throw new AppError("El establecimiento no existe", 404)
    const [dias_cerrados, { fecha_minima, fecha_maxima }] = await Promise.all([
      repository.findAll(idLocal),
      repository.dateWindow(),
    ])
    return { dias_cerrados, fecha_minima, fecha_maxima }
  })
}

export function create(idLocal, data, user) {
  idLocal = parseId(idLocal)
  if (!fechaValida(data.fecha)) throw new AppError("La fecha no es válida", 400)
  return execute(() =>
    withTransaction(async (client) => {
      if (
        !(await repository.lockManagedLocal(
          idLocal,
          user.id,
          user.rol === "Administrador",
          client,
        ))
      )
        throw new AppError("El establecimiento no existe", 404)
      const { fecha_minima, fecha_maxima } = await repository.dateWindow(client)
      if (data.fecha < fecha_minima || data.fecha > fecha_maxima)
        throw new AppError(
          `Selecciona una fecha entre ${fecha_minima} y ${fecha_maxima}`,
          400,
        )
      try {
        return await repository.create(idLocal, data, client)
      } catch (error) {
        if (error.code === "23505")
          throw new AppError("Ese día ya está marcado como cerrado", 409)
        if (error.code === "P0001")
          throw new AppError(
            "La fecha de cierre debe estar entre mañana y dos meses después",
            400,
          )
        throw error
      }
    }),
  )
}

export function remove(idLocal, idCierre, user) {
  idLocal = parseId(idLocal)
  idCierre = parseId(idCierre)
  return execute(async () => {
    const deleted = await repository.remove(
      idLocal,
      idCierre,
      user.id,
      user.rol === "Administrador",
    )
    if (!deleted) throw new AppError("El día de cierre no existe", 404)
    return { id_cierre: deleted.id_cierre }
  })
}
