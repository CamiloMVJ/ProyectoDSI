import { pool } from '../db/db.js'

export async function findAll(client = pool) {
  const { rows } = await client.query(
    'SELECT id_departamento, nombre, tipo FROM public.departamentos ORDER BY id_departamento'
  )
  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT id_departamento, nombre, tipo FROM public.departamentos WHERE id_departamento = $1',
    [id]
  )
  return rows[0] ?? null
}

export async function create({ nombre, tipo }, client = pool) {
  const { rows } = await client.query(
    'INSERT INTO public.departamentos (nombre, tipo) VALUES ($1, $2) RETURNING id_departamento, nombre, tipo',
    [nombre, tipo]
  )
  return rows[0]
}

export async function update(id, { nombre, tipo }, client = pool) {
  const { rows } = await client.query(
    'UPDATE public.departamentos SET nombre = $1, tipo = $2 WHERE id_departamento = $3 RETURNING id_departamento, nombre, tipo',
    [nombre, tipo, id]
  )
  return rows[0] ?? null
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM public.departamentos WHERE id_departamento = $1 RETURNING id_departamento, nombre, tipo',
    [id]
  )
  return rows[0] ?? null
}
