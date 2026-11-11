import { pool } from '../db/db.js'

export async function findAll(client = pool) {
  const { rows } = await client.query(`
    SELECT lc.id_local, l.nombre AS nombre_local,
           c.id_categoria, c.nombre AS nombre_categoria, c.descripcion, c.icono_url
    FROM public.locales_categorias AS lc
    JOIN public.locales AS l ON l.id_local = lc.id_local
    JOIN public.categorias AS c ON c.id_categoria = lc.id_categoria
    ORDER BY lc.id_local, c.nombre, c.id_categoria`)
  return rows
}

export async function findByLocal(idLocal, client = pool) {
  const { rows } = await client.query(`
    SELECT c.id_categoria, c.nombre, c.descripcion, c.icono_url
    FROM public.locales_categorias AS lc
    JOIN public.categorias AS c ON c.id_categoria = lc.id_categoria
    WHERE lc.id_local = $1
    ORDER BY c.nombre, c.id_categoria`, [idLocal])
  return rows
}

export async function create(idLocal, idCategoria, client = pool) {
  const { rows } = await client.query(`
    INSERT INTO public.locales_categorias (id_local, id_categoria)
    VALUES ($1, $2)
    RETURNING id_local, id_categoria`, [idLocal, idCategoria])
  return rows[0]
}

export async function remove(idLocal, idCategoria, client = pool) {
  const { rows } = await client.query(`
    DELETE FROM public.locales_categorias
    WHERE id_local = $1 AND id_categoria = $2
    RETURNING id_local, id_categoria`, [idLocal, idCategoria])
  return rows[0] ?? null
}
