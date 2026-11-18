import { pool } from '../db/db.js'

const orderBy = {
  'nombre-asc': 'nombre ASC, id_local ASC',
  'nombre-desc': 'nombre DESC, id_local DESC',
  recientes: 'id_local DESC',
}
const resultOrderBy = {
  'nombre-asc': 'resultado.nombre ASC, resultado.id_local ASC',
  'nombre-desc': 'resultado.nombre DESC, resultado.id_local DESC',
  recientes: 'resultado.id_local DESC',
}

export async function search({ q, departamento, municipio, tipo, orden, max_budget, id_categoria, page, limit }, client = pool) {
  const normalize = value => `translate(lower(coalesce(${value}, '')), 'áéíóúüñ', 'aeiouun')`
  const query = `
    WITH candidatos AS (
      SELECT l.id_local, l.nombre, l.descripcion, l.id_departamento, l.municipio,
        l.direccion_exacta, l.maps_link, d.nombre AS departamento,
        CASE WHEN ct.id_lugar IS NOT NULL THEN 'complejo'
             WHEN ai.id_lugar IS NOT NULL THEN 'atractivo' ELSE 'otro' END AS tipo,
        budget.precio_minimo, budget.precio_maximo
      FROM public.lugares_turisticos lt
      JOIN public.locales l ON l.id_local = lt.id_lugar
      JOIN public.departamentos d ON d.id_departamento = l.id_departamento
      LEFT JOIN public.complejos_turisticos ct ON ct.id_lugar = lt.id_lugar
      LEFT JOIN public.atractivos_independientes ai ON ai.id_lugar = lt.id_lugar
      LEFT JOIN LATERAL (
        SELECT MIN(precio_minimo) AS precio_minimo, MAX(precio_maximo) AS precio_maximo
        FROM public.locales_comerciales
        WHERE id_complejo_padre = lt.id_lugar AND esta_publicado = TRUE AND precio_minimo IS NOT NULL
      ) budget ON TRUE
      WHERE $4::text <> 'local'
      UNION ALL
      SELECT l.id_local, l.nombre, l.descripcion, l.id_departamento, l.municipio,
        l.direccion_exacta, l.maps_link, d.nombre AS departamento,
        'local' AS tipo, c.precio_minimo, c.precio_maximo
      FROM public.locales_comerciales c
      JOIN public.locales l ON l.id_local = c.id_local
      JOIN public.departamentos d ON d.id_departamento = l.id_departamento
      WHERE c.esta_publicado = TRUE AND $4::text IN ('todos', 'local')
    ), filtrados AS (
      SELECT * FROM candidatos p
      WHERE ($1::text = '' OR strpos(${normalize('p.nombre')}, $1) > 0
        OR strpos(${normalize('p.descripcion')}, $1) > 0
        OR strpos(${normalize('p.municipio')}, $1) > 0
        OR strpos(${normalize('p.departamento')}, $1) > 0
        OR strpos(${normalize('p.direccion_exacta')}, $1) > 0)
        AND ($2::integer IS NULL OR p.id_departamento = $2)
        AND ($3::text = '' OR strpos(${normalize('p.municipio')}, $3) > 0)
        AND ($4::text = 'todos' OR p.tipo = $4)
        AND ($5::numeric IS NULL OR p.precio_minimo <= $5)
        AND ($6::integer IS NULL OR EXISTS (
          SELECT 1 FROM public.locales_categorias lc
          WHERE lc.id_local = p.id_local AND lc.id_categoria = $6))
    ), pagina AS (
      SELECT * FROM filtrados ORDER BY ${orderBy[orden]} LIMIT $7 OFFSET $8
    )
    SELECT (SELECT COUNT(*) FROM filtrados)::integer AS total,
      COALESCE(json_agg(row_to_json(resultado) ORDER BY ${resultOrderBy[orden]}), '[]'::json) AS items
    FROM (
      SELECT p.*, imagen.url_imagen, COALESCE(horarios.horarios, '[]'::json) AS horarios
      FROM pagina p
      LEFT JOIN LATERAL (
        SELECT url_imagen FROM public.imagenes_locales
        WHERE id_local = p.id_local ORDER BY id_imagen LIMIT 1
      ) imagen ON TRUE
      LEFT JOIN LATERAL (
        SELECT json_agg(json_build_object(
          'dia_semana', h.dia_semana, 'hora_apertura', to_char(h.hora_apertura, 'HH24:MI'),
          'hora_cierre', to_char(h.hora_cierre, 'HH24:MI'), 'es_feriado', h.es_feriado
        ) ORDER BY h.id_horario) AS horarios
        FROM public.horarios h WHERE h.id_local = p.id_local AND p.tipo = 'local'
      ) horarios ON TRUE
      ORDER BY ${orderBy[orden]}
    ) resultado
  `
  const values = [q, departamento, municipio, tipo, max_budget, id_categoria, limit, (page - 1) * limit]
  const { rows } = await client.query(query, values)
  const { total, items } = rows[0]
  return { items, total, page, pageSize: limit, totalPages: Math.max(1, Math.ceil(total / limit)) }
}
