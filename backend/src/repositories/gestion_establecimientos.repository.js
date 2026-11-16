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
  , COALESCE((SELECT json_agg(json_build_object(
    'id_horario', h.id_horario, 'dia_semana', h.dia_semana,
    'hora_apertura', to_char(h.hora_apertura, 'HH24:MI'),
    'hora_cierre', to_char(h.hora_cierre, 'HH24:MI'),
    'es_feriado', h.es_feriado
  ) ORDER BY h.id_horario) FROM public.horarios h WHERE h.id_local = c.id_local), '[]'::json) AS horarios
  , COALESCE((SELECT json_agg(json_build_object(
    'id_menu', m.id_menu, 'titulo_menu', m.titulo_menu,
    'descripcion', m.descripcion, 'esta_activo', m.esta_activo,
    'items', COALESCE((SELECT json_agg(json_build_object(
      'id_item', i.id_item, 'nombre_platillo', i.nombre_platillo,
      'descripcion', i.descripcion, 'precio', i.precio, 'moneda', i.moneda,
      'url_foto', i.url_foto,
      'id_categoria_menu', i.id_categoria_menu,
      'es_vegetariano', i.es_vegetariano, 'esta_disponible', i.esta_disponible
    ) ORDER BY i.id_item) FROM public.items_menu i WHERE i.id_menu = m.id_menu), '[]'::json)
  ) ORDER BY m.id_menu) FROM public.menus m WHERE m.id_local = c.id_local), '[]'::json) AS menus
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
  if (data.horarios !== undefined) {
    const horarioIds = []
    for (const horario of data.horarios) {
      if (horario.id_horario) {
        const { rowCount } = await client.query(
          `UPDATE public.horarios SET dia_semana = $3, hora_apertura = $4,
           hora_cierre = $5, es_feriado = $6 WHERE id_local = $1 AND id_horario = $2`,
          [id, horario.id_horario, horario.dia_semana, horario.hora_apertura, horario.hora_cierre, horario.es_feriado]
        )
        if (!rowCount) return null
        horarioIds.push(horario.id_horario)
      } else {
        const { rows } = await client.query(
          `INSERT INTO public.horarios (id_local, dia_semana, hora_apertura, hora_cierre, es_feriado)
           VALUES ($1, $2, $3, $4, $5) RETURNING id_horario`,
          [id, horario.dia_semana, horario.hora_apertura, horario.hora_cierre, horario.es_feriado]
        )
        horarioIds.push(rows[0].id_horario)
      }
    }
    await client.query(
      'DELETE FROM public.horarios WHERE id_local = $1 AND NOT (id_horario = ANY($2::integer[]))',
      [id, horarioIds]
    )
  }
  if (data.menus !== undefined) {
    for (const menu of data.menus) {
      let menuId = menu.id_menu
      if (menuId) {
        const { rowCount } = await client.query(
          `UPDATE public.menus SET titulo_menu = $3, descripcion = $4, esta_activo = $5
           WHERE id_local = $1 AND id_menu = $2`,
          [id, menuId, menu.titulo_menu, menu.descripcion, menu.esta_activo]
        )
        if (!rowCount) return null
      } else {
        const { rows } = await client.query(
          `INSERT INTO public.menus (id_local, titulo_menu, descripcion, esta_activo)
           VALUES ($1, $2, $3, $4) RETURNING id_menu`,
          [id, menu.titulo_menu, menu.descripcion, menu.esta_activo]
        )
        menuId = rows[0].id_menu
      }
      for (const item of menu.items) {
        const values = [menuId, item.nombre_platillo, item.descripcion, item.precio,
          item.moneda, item.url_foto, item.id_categoria_menu, item.es_vegetariano, item.esta_disponible]
        if (item.id_item) {
          const { rowCount } = await client.query(
            `UPDATE public.items_menu SET nombre_platillo = $3, descripcion = $4,
             precio = $5, moneda = $6, url_foto = $7, id_categoria_menu = $8,
             es_vegetariano = $9, esta_disponible = $10
             WHERE id_menu = $1 AND id_item = $2`,
            [menuId, item.id_item, ...values.slice(1)]
          )
          if (!rowCount) return null
        } else {
          await client.query(
            `INSERT INTO public.items_menu (id_menu, nombre_platillo, descripcion,
             precio, moneda, url_foto, id_categoria_menu, es_vegetariano, esta_disponible)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, values
          )
        }
      }
    }
  }
  return findOne(id, client)
}
