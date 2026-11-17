import { pool } from "../db/db.js"

export const managedLocalSelection = `SELECT l.id_local FROM public.locales l
  LEFT JOIN public.locales_comerciales c ON c.id_local = l.id_local
  LEFT JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
  LEFT JOIN public.lugares_turisticos t ON t.id_lugar = l.id_local
  WHERE l.id_local = $1 AND
    ((c.id_local IS NOT NULL AND ($2::boolean OR p.id_usuario = $3))
      OR (t.id_lugar IS NOT NULL AND $2::boolean))`

export async function findManagedLocal(
  localId,
  userId,
  isAdmin,
  client = pool,
) {
  const { rows } = await client.query(managedLocalSelection, [
    localId,
    isAdmin,
    userId,
  ])
  return rows[0] ?? null
}
