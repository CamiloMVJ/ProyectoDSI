import { pool } from '../db/db.js'

const columns = `l.id_lugar, base.nombre, base.descripcion, base.id_departamento,
                 base.municipio, base.direccion_exacta, base.maps_link`
const from = `FROM public.lugares_turisticos AS l
              JOIN public.locales AS base ON base.id_local = l.id_lugar`
const orderBy = {
  'nombre-asc': 'base.nombre ASC, l.id_lugar ASC',
  'nombre-desc': 'base.nombre DESC, l.id_lugar DESC',
  recientes: 'l.id_lugar DESC'
}

export async function search({ q, departamento, municipio, tipo, orden, max_budget }, client = pool) {
  const { rows } = await client.query(`
    SELECT ${columns}, d.nombre AS departamento,
           imagen.url_imagen, budget.precio_minimo, budget.precio_maximo,
           CASE WHEN c.id_lugar IS NOT NULL THEN 'complejo'
                WHEN a.id_lugar IS NOT NULL THEN 'atractivo'
                ELSE 'otro' END AS tipo
    ${from}
    JOIN public.departamentos AS d ON d.id_departamento = base.id_departamento
    LEFT JOIN public.complejos_turisticos AS c ON c.id_lugar = l.id_lugar
    LEFT JOIN public.atractivos_independientes AS a ON a.id_lugar = l.id_lugar
    LEFT JOIN LATERAL (
      SELECT url_imagen FROM public.imagenes_locales
      WHERE id_local = l.id_lugar ORDER BY id_imagen LIMIT 1
    ) AS imagen ON TRUE
    LEFT JOIN LATERAL (
      SELECT MIN(precio_minimo) AS precio_minimo, MAX(precio_maximo) AS precio_maximo
      FROM public.locales_comerciales
      WHERE id_complejo_padre = l.id_lugar AND precio_minimo IS NOT NULL
    ) AS budget ON TRUE
    WHERE ($1::text = '' OR strpos(lower(base.nombre), lower($1)) > 0
           OR strpos(lower(coalesce(base.descripcion, '')), lower($1)) > 0
           OR strpos(lower(base.municipio), lower($1)) > 0
           OR strpos(lower(d.nombre), lower($1)) > 0)
      AND ($2::integer IS NULL OR base.id_departamento = $2)
      AND ($3::text = '' OR strpos(lower(base.municipio), lower($3)) > 0)
      AND ($4::text = 'todos'
           OR ($4 = 'complejo' AND c.id_lugar IS NOT NULL)
           OR ($4 = 'atractivo' AND a.id_lugar IS NOT NULL)
           OR ($4 = 'otro' AND c.id_lugar IS NULL AND a.id_lugar IS NULL))
      AND ($5::numeric IS NULL OR budget.precio_minimo <= $5)
    ORDER BY ${orderBy[orden]}
  `, [q, departamento, municipio, tipo, max_budget])
  return rows
}

export async function findAll(client = pool) {
  const { rows } = await client.query(`SELECT ${columns} ${from} ORDER BY l.id_lugar`)
  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(`SELECT ${columns} ${from} WHERE l.id_lugar = $1`, [id])
  return rows[0] ?? null
}

export async function create(data, client) {
  const values = [data.nombre, data.descripcion ?? null, data.municipio,
    data.direccion_exacta ?? null, data.maps_link ?? null, data.id_departamento]
  const { rows: base } = await client.query(`
    INSERT INTO public.locales (nombre, descripcion, municipio, direccion_exacta, maps_link, id_departamento)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_local`, values)
  await client.query('INSERT INTO public.lugares_turisticos (id_lugar) VALUES ($1)', [base[0].id_local])
  return findOne(base[0].id_local, client)
}

export async function update(id, data, client = pool) {
  const { rows } = await client.query(`
    UPDATE public.locales SET nombre = $1, descripcion = $2, id_departamento = $3,
      municipio = $4, direccion_exacta = $5, maps_link = $6
    WHERE id_local = $7 AND EXISTS (SELECT 1 FROM public.lugares_turisticos WHERE id_lugar = $7)
    RETURNING id_local`, [data.nombre, data.descripcion ?? null, data.id_departamento,
      data.municipio, data.direccion_exacta ?? null, data.maps_link ?? null, id])
  return rows[0] ? findOne(id, client) : null
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(`DELETE FROM public.locales
    WHERE id_local = $1 AND EXISTS (SELECT 1 FROM public.lugares_turisticos WHERE id_lugar = $1)
    RETURNING id_local`, [id])
  return rows[0] ?? null
}
