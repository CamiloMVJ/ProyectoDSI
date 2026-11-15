import { pool } from '../db/db.js'

// Columnas permitidas del script SQL. Los valores se pasan como parámetros.
const fields = ["nombre_completo", "email", "password_hash", "fecha_registro", "telefono"]
const roleSql = `COALESCE(
  (SELECT a.rol FROM public.administradores a WHERE a.id_usuario = u.id_usuario LIMIT 1),
  CASE WHEN EXISTS (
    SELECT 1 FROM public.propietarios_negocios p WHERE p.id_usuario = u.id_usuario
  ) THEN 'Propietario' ELSE 'Usuario' END
) AS rol`

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
    `SELECT u.id_usuario, u.nombre_completo, u.email, u.telefono, ${roleSql}
     FROM public.usuarios u ORDER BY u.id_usuario`
  )

  return rows
}

export async function findByEmail(email, client = pool) {
  const { rows } = await client.query(
    `SELECT u.*, ${roleSql} FROM public.usuarios u WHERE u.email = $1`,
    [email]
  );
  return rows[0];
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    `SELECT u.id_usuario, u.nombre_completo, u.email, u.telefono, ${roleSql}
     FROM public.usuarios u WHERE u.id_usuario = $1`,
    [id]
  )

  return rows[0] ?? null
}

export async function create(data, client = pool) {
  const entries = getEntries(data)
  const columns = entries.map(([field]) => field).join(', ')
  const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ')
  const values = entries.map(([, value]) => value)
  // console.log('Entries:', entries)
  // Omitir campos conserva los DEFAULT definidos en PostgreSQL.
  const sql = entries.length
    ? `INSERT INTO public.usuarios (${columns}) VALUES (${placeholders}) RETURNING id_usuario, nombre_completo, email, telefono`
    : 'INSERT INTO public.usuarios DEFAULT VALUES RETURNING id_usuario, nombre_completo, email, telefono'
  // console.log("Data: ", data)
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
    `UPDATE public.usuarios SET ${assignments} WHERE id_usuario = $${values.length} RETURNING id_usuario, nombre_completo, email, telefono`,
    values
  )

  return rows[0] ?? null
}

export async function remove(id, client = pool) {
  const { rowCount } = await client.query(
    'DELETE FROM public.usuarios WHERE id_usuario = $1',
    [id]
  )

  return rowCount > 0
}
