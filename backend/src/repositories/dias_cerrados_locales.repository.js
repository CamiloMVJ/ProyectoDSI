import { pool } from "../db/db.js"

export async function findManagedLocal(
  idLocal,
  userId,
  isAdmin,
  client = pool,
) {
  const { rows } = await client.query(
    `SELECT c.id_local FROM public.locales_comerciales c
     JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
     WHERE c.id_local = $1 AND ($2::boolean OR p.id_usuario = $3)`,
    [idLocal, isAdmin, userId],
  )
  return rows[0] ?? null
}

export async function dateWindow(client = pool) {
  const { rows } = await client.query(
    `SELECT to_char(((CURRENT_TIMESTAMP AT TIME ZONE 'America/Managua')::date + 1), 'YYYY-MM-DD') AS fecha_minima,
            to_char(((CURRENT_TIMESTAMP AT TIME ZONE 'America/Managua')::date + INTERVAL '2 months')::date, 'YYYY-MM-DD') AS fecha_maxima`,
  )
  return rows[0]
}

export async function findAll(idLocal, client = pool) {
  const { rows } = await client.query(
    `SELECT id_cierre, id_local, to_char(fecha, 'YYYY-MM-DD') AS fecha, motivo, fecha_registro
     FROM public.dias_cerrados_locales
     WHERE id_local = $1 AND fecha >= (CURRENT_TIMESTAMP AT TIME ZONE 'America/Managua')::date
     ORDER BY fecha, id_cierre`,
    [idLocal],
  )
  return rows
}

export async function create(idLocal, data, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO public.dias_cerrados_locales (id_local, fecha, motivo)
     VALUES ($1, $2::date, $3)
     RETURNING id_cierre, id_local, to_char(fecha, 'YYYY-MM-DD') AS fecha, motivo, fecha_registro`,
    [idLocal, data.fecha, data.motivo || null],
  )
  return rows[0]
}

export async function remove(
  idLocal,
  idCierre,
  userId,
  isAdmin,
  client = pool,
) {
  const { rows } = await client.query(
    `DELETE FROM public.dias_cerrados_locales d
     USING public.locales_comerciales c, public.propietarios_negocios p
     WHERE d.id_cierre = $2 AND d.id_local = $1 AND c.id_local = d.id_local
       AND p.id_propietario = c.id_dueno AND ($3::boolean OR p.id_usuario = $4)
     RETURNING d.id_cierre`,
    [idLocal, idCierre, isAdmin, userId],
  )
  return rows[0] ?? null
}
