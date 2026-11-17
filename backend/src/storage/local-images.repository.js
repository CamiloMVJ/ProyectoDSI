import { pool } from '../db/db.js'

export async function findManagedLocal(localId, userId, isAdmin, client = pool) {
  const { rows } = await client.query(
    `SELECT c.id_local FROM public.locales_comerciales c
     JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
     WHERE c.id_local = $1 AND ($2::boolean OR p.id_usuario = $3)`,
    [localId, isAdmin, userId],
  )
  return rows[0] ?? null
}

export async function findAll(localId, userId, isAdmin, client = pool) {
  const { rows } = await client.query(
    `SELECT i.id_imagen, i.id_local, i.url_imagen, i.descripcion, i.fecha_subida
     FROM public.imagenes_locales i
     JOIN public.locales_comerciales c ON c.id_local = i.id_local
     JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
     WHERE i.id_local = $1 AND ($2::boolean OR p.id_usuario = $3)
     ORDER BY i.id_imagen DESC`,
    [localId, isAdmin, userId],
  )
  return rows
}

export async function saveImage(localId, userId, isAdmin, url, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO public.imagenes_locales (id_local, url_imagen)
     SELECT c.id_local, $4 FROM public.locales_comerciales c
     JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
     WHERE c.id_local = $1 AND ($2::boolean OR p.id_usuario = $3)
     RETURNING id_imagen, id_local, url_imagen, descripcion, fecha_subida`,
    [localId, isAdmin, userId, url],
  )
  return rows[0] ?? null
}

export async function findOwnedImage(localId, imageId, userId, isAdmin, client = pool) {
  const { rows } = await client.query(
    `SELECT i.id_imagen, i.url_imagen FROM public.imagenes_locales i
     JOIN public.locales_comerciales c ON c.id_local = i.id_local
     JOIN public.propietarios_negocios p ON p.id_propietario = c.id_dueno
     WHERE i.id_local = $1 AND i.id_imagen = $2 AND ($3::boolean OR p.id_usuario = $4)
     FOR UPDATE OF i`,
    [localId, imageId, isAdmin, userId],
  )
  return rows[0] ?? null
}

export async function deleteImage(localId, imageId, client = pool) {
  await client.query(
    'DELETE FROM public.imagenes_locales WHERE id_local = $1 AND id_imagen = $2',
    [localId, imageId],
  )
}
