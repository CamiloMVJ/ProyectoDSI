import { pool } from '../db/db.js'

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT id_administrador, id_usuario, rol FROM public.administradores ORDER BY id_administrador')
  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query('SELECT id_administrador, id_usuario, rol FROM public.administradores WHERE id_administrador = $1', [id])
  return rows[0] ?? null
}

export async function create(data, client = pool) {
  const { rows } = await client.query(
    'INSERT INTO public.administradores (id_usuario, rol) VALUES ($1, $2) RETURNING id_administrador, id_usuario, rol',
    [data.id_usuario, data.rol ?? 'Administrador']
  )
  return rows[0]
}

export async function update(id, data, client = pool) {
  const { rows } = await client.query(
    'UPDATE public.administradores SET id_usuario = $1, rol = $2 WHERE id_administrador = $3 RETURNING id_administrador, id_usuario, rol',
    [data.id_usuario, data.rol, id]
  )
  return rows[0] ?? null
}

export async function remove(id, client = pool) {
  const { rowCount } = await client.query('DELETE FROM public.administradores WHERE id_administrador = $1', [id])
  return rowCount > 0
}
