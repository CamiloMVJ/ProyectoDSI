import { pool } from '../db/db.js'

export async function findOne(id, client = pool) {
  const { rows } = await client.query('SELECT id_local FROM public.locales WHERE id_local = $1', [id])
  return rows[0] ?? null
}
