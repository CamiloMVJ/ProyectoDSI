import { pool } from "../db/db.js"

const selection = `SELECT l.id_local AS id_lugar, l.nombre, l.descripcion, l.id_departamento,
  d.nombre AS departamento, l.municipio, l.direccion_exacta, l.maps_link,
  l.telefono_contacto, l.correo_contacto, l.sitio_web,
  CASE WHEN c.id_lugar IS NOT NULL THEN 'complejo'
       WHEN a.id_lugar IS NOT NULL THEN 'atractivo' ELSE 'otro' END AS tipo,
  c.capacidad_locales, c.cobro_entrada, c.costo_entrada,
  a.tipo_acceso, a.entidad_encargada, a.normativa_visitantes,
  COALESCE(c.id_administrador, a.id_administrador) AS id_administrador,
  COALESCE((SELECT json_agg(json_build_object(
    'id_horario', h.id_horario, 'dia_semana', h.dia_semana,
    'hora_apertura', to_char(h.hora_apertura, 'HH24:MI'),
    'hora_cierre', to_char(h.hora_cierre, 'HH24:MI'), 'es_feriado', h.es_feriado
  ) ORDER BY h.id_horario) FROM public.horarios h WHERE h.id_local = l.id_local), '[]'::json) AS horarios,
  COALESCE((SELECT json_agg(lc.id_categoria ORDER BY lc.id_categoria)
    FROM public.locales_categorias lc WHERE lc.id_local = l.id_local), '[]'::json) AS categorias,
  COALESCE((SELECT json_agg(json_build_object(
    'id_imagen', i.id_imagen, 'url_imagen', i.url_imagen, 'descripcion', i.descripcion
  ) ORDER BY i.id_imagen DESC) FROM public.imagenes_locales i WHERE i.id_local = l.id_local), '[]'::json) AS imagenes
  FROM public.lugares_turisticos t
  JOIN public.locales l ON l.id_local = t.id_lugar
  JOIN public.departamentos d ON d.id_departamento = l.id_departamento
  LEFT JOIN public.complejos_turisticos c ON c.id_lugar = t.id_lugar
  LEFT JOIN public.atractivos_independientes a ON a.id_lugar = t.id_lugar`

export async function findAll(client = pool) {
  const { rows } = await client.query(
    `${selection} ORDER BY l.nombre, l.id_local`,
  )
  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(`${selection} WHERE t.id_lugar = $1`, [
    id,
  ])
  return rows[0] ?? null
}

export async function lock(id, client) {
  const { rows } = await client.query(
    `SELECT t.id_lugar FROM public.lugares_turisticos t
     JOIN public.locales l ON l.id_local = t.id_lugar
     WHERE t.id_lugar = $1 FOR UPDATE OF t, l`,
    [id],
  )
  return Boolean(rows[0])
}

export async function save(id, data, client) {
  await client.query(
    `UPDATE public.locales SET nombre = $2, descripcion = $3, id_departamento = $4,
      municipio = $5, direccion_exacta = $6, maps_link = $7,
      telefono_contacto = $8, correo_contacto = $9, sitio_web = $10
     WHERE id_local = $1`,
    [
      id,
      data.nombre,
      data.descripcion,
      data.id_departamento,
      data.municipio,
      data.direccion_exacta,
      data.maps_link,
      data.telefono_contacto,
      data.correo_contacto,
      data.sitio_web,
    ],
  )
  if (data.tipo === "complejo") {
    const { rowCount } = await client.query(
      `UPDATE public.complejos_turisticos SET capacidad_locales = $2,
        cobro_entrada = $3, costo_entrada = $4, id_administrador = $5
       WHERE id_lugar = $1`,
      [
        id,
        data.capacidad_locales,
        data.cobro_entrada,
        data.cobro_entrada ? data.costo_entrada : null,
        data.id_administrador,
      ],
    )
    if (!rowCount) return null
  } else if (data.tipo === "atractivo") {
    const { rowCount } = await client.query(
      `UPDATE public.atractivos_independientes SET tipo_acceso = $2,
        entidad_encargada = $3, normativa_visitantes = $4, id_administrador = $5
       WHERE id_lugar = $1`,
      [
        id,
        data.tipo_acceso,
        data.entidad_encargada,
        data.normativa_visitantes,
        data.id_administrador,
      ],
    )
    if (!rowCount) return null
  }
  const horarioIds = []
  for (const horario of data.horarios) {
    if (horario.id_horario) {
      const { rowCount } = await client.query(
        `UPDATE public.horarios SET dia_semana = $3, hora_apertura = $4,
          hora_cierre = $5, es_feriado = $6
         WHERE id_local = $1 AND id_horario = $2`,
        [
          id,
          horario.id_horario,
          horario.dia_semana,
          horario.hora_apertura,
          horario.hora_cierre,
          horario.es_feriado,
        ],
      )
      if (!rowCount) return null
      horarioIds.push(horario.id_horario)
    } else {
      const { rows } = await client.query(
        `INSERT INTO public.horarios (id_local, dia_semana, hora_apertura, hora_cierre, es_feriado)
         VALUES ($1, $2, $3, $4, $5) RETURNING id_horario`,
        [
          id,
          horario.dia_semana,
          horario.hora_apertura,
          horario.hora_cierre,
          horario.es_feriado,
        ],
      )
      horarioIds.push(rows[0].id_horario)
    }
  }
  await client.query(
    "DELETE FROM public.horarios WHERE id_local = $1 AND NOT (id_horario = ANY($2::integer[]))",
    [id, horarioIds],
  )
  await client.query(
    "DELETE FROM public.locales_categorias WHERE id_local = $1 AND NOT (id_categoria = ANY($2::integer[]))",
    [id, data.categorias],
  )
  for (const categoryId of data.categorias) {
    await client.query(
      `INSERT INTO public.locales_categorias (id_local, id_categoria)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [id, categoryId],
    )
  }
  return findOne(id, client)
}

export async function findAdministrators(client = pool) {
  const { rows } = await client.query(
    `SELECT a.id_administrador, u.nombre_completo
     FROM public.administradores a
     JOIN public.usuarios u ON u.id_usuario = a.id_usuario
     ORDER BY u.nombre_completo, a.id_administrador`,
  )
  return rows
}
