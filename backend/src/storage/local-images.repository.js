import { pool } from "../db/db.js"
import { managedLocalSelection } from "../repositories/managed-locals.repository.js"
export { findManagedLocal } from "../repositories/managed-locals.repository.js"

export async function findAll(localId, userId, isAdmin, client = pool) {
  const { rows } = await client.query(
    `SELECT i.id_imagen, i.id_local, i.url_imagen, i.descripcion, i.fecha_subida
     FROM public.imagenes_locales i
     WHERE i.id_local IN (${managedLocalSelection})
     ORDER BY i.id_imagen DESC`,
    [localId, isAdmin, userId],
  )
  return rows
}

export async function saveImage(localId, userId, isAdmin, url, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO public.imagenes_locales (id_local, url_imagen)
     SELECT id_local, $4 FROM (${managedLocalSelection}) AS permitted
     RETURNING id_imagen, id_local, url_imagen, descripcion, fecha_subida`,
    [localId, isAdmin, userId, url],
  )
  return rows[0] ?? null
}

export async function findOwnedImage(
  localId,
  imageId,
  userId,
  isAdmin,
  client = pool,
) {
  const { rows } = await client.query(
    `SELECT i.id_imagen, i.url_imagen FROM public.imagenes_locales i
     WHERE i.id_local IN (${managedLocalSelection}) AND i.id_imagen = $4
     FOR UPDATE OF i`,
    [localId, isAdmin, userId, imageId],
  )
  return rows[0] ?? null
}

export async function deleteImage(localId, imageId, client = pool) {
  await client.query(
    "DELETE FROM public.imagenes_locales WHERE id_local = $1 AND id_imagen = $2",
    [localId, imageId],
  )
}
