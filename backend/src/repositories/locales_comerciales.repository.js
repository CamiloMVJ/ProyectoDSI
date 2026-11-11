import { pool } from '../db/db.js'

// Columnas permitidas del script SQL. Los valores se pasan como parámetros.
const fields = ["codigo_ruc", "id_dueno", "id_complejo_padre", "es_independiente"]
const baseFields = ["nombre", "descripcion", "id_departamento", "municipio", "direccion_exacta", "maps_link"]
const selection = `c.*, l.nombre, l.descripcion, l.id_departamento, l.municipio, l.direccion_exacta, l.maps_link,
  d.nombre AS departamento, imagen.url_imagen`
const relation = `FROM public.locales_comerciales AS c
  JOIN public.locales AS l ON l.id_local = c.id_local
  JOIN public.departamentos AS d ON d.id_departamento = l.id_departamento
  LEFT JOIN LATERAL (
    SELECT url_imagen FROM public.imagenes_locales
    WHERE id_local = c.id_local ORDER BY id_imagen LIMIT 1
  ) AS imagen ON TRUE`

function getEntries(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('data debe ser un objeto')
  }

  for (const field of Object.keys(data)) {
    if (!fields.includes(field)) {
      throw new TypeError(`Campo no permitido: ${field}`)
    }
  }

  // undefined: omitir el campo. null: enviar NULL explícitamente
  return fields
    .filter((field) => data[field] !== undefined)
    .map((field) => [field, data[field]])
}

export async function findAll(maxBudget = null, idCategoria = null, client = pool) {
  const filters = []
  const values = []
  if (maxBudget != null && maxBudget !== '') {
    values.push(maxBudget)
    filters.push(`c.precio_minimo <= $${values.length}`)
  }
  if (idCategoria != null && idCategoria !== '') {
    values.push(idCategoria)
    filters.push(`EXISTS (
         SELECT 1 FROM public.locales_categorias AS lc
         WHERE lc.id_local = c.id_local AND lc.id_categoria = $${values.length}
       )`)
  }
  const { rows } = await client.query(
    `SELECT ${selection} ${relation}
     ${filters.length ? `WHERE ${filters.join('\n       AND ')}` : ''}
     ORDER BY c.id_local`,
    values
  )

  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    `SELECT ${selection} ${relation} WHERE c.id_local = $1`,
    [id]
  )

  return rows[0] ?? null
}

export async function create(data, client = pool) {
  const base = baseFields.map((field) => data[field] ?? null)
  const { rows: locales } = await client.query(`INSERT INTO public.locales
    (nombre, descripcion, id_departamento, municipio, direccion_exacta, maps_link)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_local`, base)
  const id = locales[0].id_local
  const entries = getEntries(Object.fromEntries(fields.filter((field) => data[field] !== undefined)
    .map((field) => [field, data[field]])))
  const columns = entries.map(([field]) => field).join(', ')
  const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ')
  const values = entries.map(([, value]) => value)

  // Omitir campos conserva los DEFAULT definidos en PostgreSQL.
  const sql = entries.length
    ? `INSERT INTO public.locales_comerciales (id_local, ${columns}) VALUES ($${values.length + 1}, ${placeholders}) RETURNING *`
    : 'INSERT INTO public.locales_comerciales (id_local) VALUES ($1) RETURNING *'

  await client.query(sql, entries.length ? [...values, id] : [id])

  return findOne(id, client)
}

export async function update(id, data, client = pool) {
  // console.log('data', data)
  const entries = getEntries(Object.fromEntries(fields.filter((field) => data[field] !== undefined)
    .map((field) => [field, data[field]])))

  const baseEntries = baseFields.filter((field) => data[field] !== undefined)
  if (entries.length === 0 && baseEntries.length === 0) {
    throw new TypeError('Debés enviar al menos un campo para actualizar')
  }

  const assignments = entries
    .map(([field], index) => `${field} = $${index + 1}`)
    .join(', ')

  const values = entries.map(([, value]) => value)
  values.push(id)

  if (baseEntries.length) {
    await client.query(`UPDATE public.locales SET ${baseEntries.map((field, index) => `${field} = $${index + 1}`).join(', ')}
      WHERE id_local = $${baseEntries.length + 1}`, [...baseEntries.map((field) => data[field]), id])
  }
  if (entries.length) {
    await client.query(`UPDATE public.locales_comerciales SET ${assignments} WHERE id_local = $${values.length}`,
      values)
  }

  return findOne(id, client)
}

export async function remove(id, client = pool) {
  const { rowCount } = await client.query(
    'DELETE FROM public.locales WHERE id_local = $1 AND EXISTS (SELECT 1 FROM public.locales_comerciales WHERE id_local = $1)',
    [id]
  )

  return rowCount > 0
}
