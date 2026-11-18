import { pool } from '../db/db.js'

export async function findAll(client = pool) {
  const { rows } = await client.query(
    'SELECT id_categoria_menu, nombre, descripcion FROM public.categorias_menu ORDER BY id_categoria_menu'
  )
  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT id_categoria_menu, nombre, descripcion FROM public.categorias_menu WHERE id_categoria_menu = $1',
    [id]
  )
  return rows[0] ?? null
}
