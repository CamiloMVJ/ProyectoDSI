import { pool } from '../db/db.js'

// Columnas permitidas del script SQL. Los valores se pasan como parámetros.
const fields = ["id_usuario", "nombre_negocio", "razon_social", "codigo_ruc", "numero_cedula_solicitante", "tipo_persona", "descripcion", "es_independiente", "id_complejo_padre", "municipio", "direccion_exacta", "maps_link", "telefono_contacto", "correo_contacto", "sitio_web", "id_departamento", "estado"]

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
  return findDetailed(null, client)
}

export async function findByUser(idUsuario, client = pool) {
  return findDetailed(idUsuario, client)
}

async function findDetailed(idUsuario, client) {
  const { rows } = await client.query(
    `SELECT s.id_solicitud, s.id_usuario, u.nombre_completo AS nombre_solicitante,
            u.email AS correo_solicitante, s.nombre_negocio, s.razon_social, s.codigo_ruc,
            s.numero_cedula_solicitante, s.tipo_persona, s.descripcion,
            s.es_independiente, s.id_complejo_padre, complejo.nombre AS nombre_complejo,
            s.municipio, s.direccion_exacta, s.maps_link,
            s.telefono_contacto, s.correo_contacto, s.sitio_web,
            s.id_departamento, d.nombre AS nombre_departamento,
            s.fecha_solicitud, s.estado,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id_categoria', c.id_categoria,
                'nombre', c.nombre
              ) ORDER BY c.nombre)
              FROM public.solicitudes_categorias sc
              JOIN public.categorias c ON c.id_categoria = sc.id_categoria
              WHERE sc.id_solicitud = s.id_solicitud
            ), '[]'::json) AS categorias,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id_documento', doc.id_documento,
                'nombre_archivo', doc.nombre_archivo,
                'tipo_documento', doc.tipo_documento
              ) ORDER BY doc.id_documento)
              FROM public.documentos_solicitudes doc
              WHERE doc.id_solicitud = s.id_solicitud
            ), '[]'::json) AS documentos
     FROM public.solicitudes_registros s
     JOIN public.usuarios u ON u.id_usuario = s.id_usuario
     JOIN public.departamentos d ON d.id_departamento = s.id_departamento
     LEFT JOIN public.locales complejo ON complejo.id_local = s.id_complejo_padre
     ${idUsuario == null ? '' : 'WHERE s.id_usuario = $1'}
     ORDER BY s.fecha_solicitud DESC, s.id_solicitud DESC`,
    idUsuario == null ? [] : [idUsuario]
  )
  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM public.solicitudes_registros WHERE id_solicitud = $1',
    [id]
  )

  return rows[0] ?? null
}

export async function lockRuc(codigoRuc, client = pool) {
  await client.query(
    "SELECT pg_advisory_xact_lock(hashtext('solicitudes_registros'), hashtext($1))",
    [codigoRuc]
  )
}

export async function existsApprovedLocalWithRuc(codigoRuc, client = pool) {
  const { rows } = await client.query(
    'SELECT EXISTS (SELECT 1 FROM public.locales_comerciales WHERE codigo_ruc = $1) AS existe',
    [codigoRuc]
  )
  return rows[0].existe
}

export async function existsPendingWithRuc(codigoRuc, client = pool) {
  const { rows } = await client.query(
    "SELECT EXISTS (SELECT 1 FROM public.solicitudes_registros WHERE codigo_ruc = $1 AND estado = 'Pendiente') AS existe",
    [codigoRuc]
  )
  return rows[0].existe
}

export async function create(data, client = pool) {
  const entries = getEntries(data)
  const columns = entries.map(([field]) => field).join(', ')
  const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ')
  const values = entries.map(([, value]) => value)

  // Omitir campos conserva los DEFAULT definidos en PostgreSQL.
  const sql = entries.length
    ? `INSERT INTO public.solicitudes_registros (${columns}) VALUES (${placeholders}) RETURNING *`
    : 'INSERT INTO public.solicitudes_registros DEFAULT VALUES RETURNING *'

  const { rows } = await client.query(sql, values)

  return rows[0]
}

export async function addCategories(idSolicitud, categorias, client = pool) {
  if (!categorias.length) return
  await client.query(
    `INSERT INTO public.solicitudes_categorias (id_solicitud, id_categoria)
     SELECT $1, categoria.id_categoria FROM unnest($2::integer[]) AS categoria(id_categoria)`,
    [idSolicitud, categorias]
  )
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
    `UPDATE public.solicitudes_registros SET ${assignments} WHERE id_solicitud = $${values.length} RETURNING *`,
    values
  )

  return rows[0] ?? null
}

export async function decide(id, estado, client = pool) {
  const { rows } = await client.query(
    `UPDATE public.solicitudes_registros
     SET estado = $2
     WHERE id_solicitud = $1 AND estado = 'Pendiente'
     RETURNING *`,
    [id, estado]
  )
  return rows[0] ?? null
}

export async function remove(id, client = pool) {
  const { rowCount } = await client.query(
    'DELETE FROM public.solicitudes_registros WHERE id_solicitud = $1',
    [id]
  )

  return rowCount > 0
}
