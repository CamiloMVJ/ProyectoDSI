import { pool } from '../db/db.js'
import { AppError } from '../errors/app-error.js'
import { lockOne } from '../repositories/locks.repository.js'

export function parseId(id) {
  if (!['string', 'number'].includes(typeof id) || !/^\d+$/.test(String(id))) {
    throw new AppError('El ID debe ser un entero positivo', 400)
  }
  const value = Number(id)
  if (!Number.isInteger(value) || value <= 0 || value > 2147483647) {
    throw new AppError('El ID debe ser un entero positivo válido', 400)
  }
  return value
}

export function allowedData(data, fields) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new AppError('Debés enviar un objeto con datos', 400)
  }
  const result = {}
  for (const [key, value] of Object.entries(data)) {
    if (!fields.includes(key)) throw new AppError(`Campo no permitido: ${key}`, 400)
    if (value !== undefined) result[key] = value
  }
  if (!Object.keys(result).length) throw new AppError('Debés enviar al menos un campo', 400)
  return result
}

export function pick(record, fields) {
  return Object.fromEntries(fields.filter((key) => record[key] !== undefined)
    .map((key) => [key, record[key]]))
}

export async function requireReference(repository, id, label, client) {
  if (id === null || id === undefined) return // Referencia opcional.
  if (!await repository.findOne(parseId(id), client)) {
    throw new AppError(`${label} no existe`, 400)
  }
}

export function checkDates(data) {
  const start = new Date(data.fecha_inicio)
  const end = new Date(data.fecha_fin)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    throw new AppError('La fecha final debe ser válida e igual o posterior a la inicial', 400)
  }
}

export function normalizeEvent(data) {
  return { ...data,
    ...(data.hora_inicio === '' ? { hora_inicio: null } : {}),
    ...(data.hora_fin === '' ? { hora_fin: null } : {})
  }
}

export function checkEvent(data) {
  checkDates(data)
  if (data.es_gratuito && data.costo_entrada != null && Number(data.costo_entrada) !== 0) {
    throw new AppError('Un evento gratuito no puede tener un costo de entrada positivo', 400)
  }
}

export function publicUser(user) {
  // Lista explícita: nunca devolver password ni password_hash.
  return pick(user, ['id_usuario', 'nombre_completo', 'email', 'fecha_registro', 'telefono'])
}

export async function execute(operation) {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof AppError) throw error
    if (error.code === '23503') throw new AppError('La referencia no existe o el registro tiene dependencias que impiden eliminarlo', 409)
    if (error.code === '23505') throw new AppError('Ya existe un registro con ese valor único', 409)
    if (['23502', '23514', '22P02', '22003', '22007', '22008', '22001'].includes(error.code)) {
      throw new AppError('Los datos no cumplen las restricciones de la base de datos', 400)
    }
    // No ocultar fallos inesperados: el middleware responderá 500.
    throw error
  }
}

export async function withLockedRecord(table, id, repository, label, operation) {
  const client = await pool.connect()
  let started = false
  try {
    await client.query('BEGIN')
    started = true
    if (!await lockOne(table, id, client)) throw new AppError(`${label} no existe`, 404)
    const current = await repository.findOne(id, client)
    if (!current) throw new AppError(`${label} no existe`, 404)
    const result = await operation(current, client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    if (started) {
      try { await client.query('ROLLBACK') } catch { /* conservar el error original */ }
    }
    throw error
  } finally {
    client.release()
  }
}
