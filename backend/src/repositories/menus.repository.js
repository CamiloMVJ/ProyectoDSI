import { pool } from '../db/db.js'

// Columnas permitidas del script SQL. Los valores se pasan como parámetros.
const fields = ["id_local", "titulo_menu", "descripcion", "esta_activo"]

function getEntries(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('data debe ser un objeto')
  }

  for (const field of Object.keys(data)) {
    if (!fields.includes(field)) {
      throw new TypeError(`Campo no permitido: ${field}`)
    }
  }

  // undefined: omitir el campo. null: enviar NULL explícitamente.
  return fields
    .filter((field) => data[field] !== undefined)
    .map((field) => [field, data[field]])
}

export async function findAll(client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM public.menus ORDER BY id_menu'
  )

  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM public.menus WHERE id_menu = $1',
    [id]
  )

  return rows[0] ?? null
}

export async function create(data, client = pool) {
  const entries = getEntries(data)
  const columns = entries.map(([field]) => field).join(', ')
  const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ')
  const values = entries.map(([, value]) => value)

  // Omitir campos conserva los DEFAULT definidos en PostgreSQL.
  const sql = entries.length
    ? `INSERT INTO public.menus (${columns}) VALUES (${placeholders}) RETURNING *`
    : 'INSERT INTO public.menus DEFAULT VALUES RETURNING *'

  const { rows } = await client.query(sql, values)

  return rows[0]
}

export async function update(id, data, client = pool) {
  const entries = getEntries(data)

  if (entries.length === 0) {
    throw new TypeError('Debés enviar al menos un campo para actualizar')
  }

  const assignments = entries
    .map(([field], index) => `${field} = $${index + 1}`)
    .join(', ')

  const values = entries.map(([, value]) => value)
  values.push(id)

  const { rows } = await client.query(
    `UPDATE public.menus SET ${assignments} WHERE id_menu = $${values.length} RETURNING *`,
    values
  )

  return rows[0] ?? null
}

export async function remove(id, client = pool) {
  const { rowCount } = await client.query(
    'DELETE FROM public.menus WHERE id_menu = $1',
    [id]
  )

  return rowCount > 0
}
