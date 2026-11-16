import { pool } from '../db/db.js'

const selection = `SELECT c.id_local, c.codigo_ruc, c.razon_social, c.esta_publicado,
  c.es_independiente, c.id_complejo_padre, complejo.nombre AS nombre_complejo,
  l.nombre, l.descripcion, l.id_departamento, d.nombre AS departamento,
  l.municipio, l.direccion_exacta, l.maps_link,
  l.telefono_contacto, l.correo_contacto, l.sitio_web,
  p.id_propietario, u.nombre_completo AS propietario, u.email AS correo_propietario,
  COALESCE((SELECT json_agg(json_build_object(
    'id_servicio', s.id_servicio, 'nombre_servicio', s.nombre_servicio,
    'precio', s.precio, 'moneda', s.moneda
  ) ORDER BY s.id_servicio) FROM public.servicios s
  WHERE s.id_local = c.id_local AND s.esta_disponible = TRUE), '[]'::json) AS servicios
  FROM public.locales_comerciales c
  JOIN public.locales l ON l.id_local = c.id_local
  JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
  JOIN public.usuarios u ON u.id_usuario = p.id_usuario
  JOIN public.departamentos d ON d.id_departamento = l.id_departamento
  LEFT JOIN public.locales complejo ON complejo.id_local = c.id_complejo_padre`

export async function findAll(userId, isAdmin, client = pool) {
  const { rows } = await client.query(`${selection} WHERE ($1::boolean OR p.id_usuario = $2) ORDER BY c.id_local DESC`, [isAdmin, userId])
  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(`${selection} WHERE c.id_local = $1`, [id])
  return rows[0] ?? null
}

export async function lock(id, userId, isAdmin, client) {
  const { rows } = await client.query(
    `SELECT c.id_local FROM public.locales_comerciales c
     JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
     WHERE c.id_local = $1 AND ($2::boolean OR p.id_usuario = $3) FOR UPDATE OF c`,
    [id, isAdmin, userId]
  )
  return rows[0] ?? null
}

export async function save(id, data, client) {
  await client.query(
    `UPDATE public.locales SET nombre = $2, descripcion = $3, id_departamento = $4,
      municipio = $5, direccion_exacta = $6, maps_link = $7,
      telefono_contacto = $8, correo_contacto = $9, sitio_web = $10
     WHERE id_local = $1`,
    [id, data.nombre, data.descripcion, data.id_departamento, data.municipio,
      data.direccion_exacta, data.maps_link, data.telefono_contacto,
      data.correo_contacto, data.sitio_web]
  )
  await client.query(
    `UPDATE public.locales_comerciales SET codigo_ruc = $2, razon_social = $3,
      es_independiente = $4, id_complejo_padre = $5, esta_publicado = $6
     WHERE id_local = $1`,
    [id, data.codigo_ruc, data.razon_social, data.es_independiente,
      data.es_independiente ? null : data.id_complejo_padre, data.esta_publicado]
  )
  const activeIds = []
  for (const servicio of data.servicios) {
    if (servicio.id_servicio) {
      const { rowCount } = await client.query(
        `UPDATE public.servicios SET nombre_servicio = $3, precio = $4,
          moneda = $5, esta_disponible = TRUE
         WHERE id_local = $1 AND id_servicio = $2`,
        [id, servicio.id_servicio, servicio.nombre_servicio, servicio.precio, servicio.moneda]
      )
      if (!rowCount) return null
      activeIds.push(servicio.id_servicio)
    } else {
      const { rows } = await client.query(
        `INSERT INTO public.servicios (id_local, nombre_servicio, precio, moneda)
         VALUES ($1, $2, $3, $4) RETURNING id_servicio`,
        [id, servicio.nombre_servicio, servicio.precio, servicio.moneda]
      )
      activeIds.push(rows[0].id_servicio)
    }
  }
  await client.query(
    'UPDATE public.servicios SET esta_disponible = FALSE WHERE id_local = $1 AND NOT (id_servicio = ANY($2::integer[]))',
    [id, activeIds]
  )
  return findOne(id, client)
}
