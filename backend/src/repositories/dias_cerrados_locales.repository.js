import { pool } from "../db/db.js"
import { managedLocalSelection } from "./managed-locals.repository.js"
export { findManagedLocal } from "./managed-locals.repository.js"

export async function lockManagedLocal(idLocal, userId, isAdmin, client) {
  const { rows } = await client.query(
    `SELECT l.id_local FROM public.locales l
     WHERE l.id_local IN (${managedLocalSelection}) FOR UPDATE OF l`,
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
     WHERE d.id_cierre = $4 AND d.id_local IN (${managedLocalSelection})
     RETURNING d.id_cierre`,
    [idLocal, isAdmin, userId, idCierre],
  )
  return rows[0] ?? null
}
