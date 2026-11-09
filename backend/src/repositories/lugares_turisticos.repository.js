import { pool } from '../db/db.js';

const orderBy = {
  'nombre-asc': 'l.nombre ASC, l.id_lugar ASC',
  'nombre-desc': 'l.nombre DESC, l.id_lugar DESC',
  recientes: 'l.id_lugar DESC'
};

export async function search({ q, departamento, municipio, tipo, orden }, client = pool) {
  const { rows } = await client.query(`
    SELECT l.id_lugar, l.nombre, l.descripcion, l.id_departamento,
           d.nombre AS departamento, l.municipio, l.direccion_exacta, l.maps_link,
           imagen.url_imagen,
           CASE WHEN c.id_lugar IS NOT NULL THEN 'complejo'
                WHEN a.id_lugar IS NOT NULL THEN 'atractivo'
                ELSE 'otro' END AS tipo
    FROM public.lugares_turisticos AS l
    JOIN public.departamentos AS d ON d.id_departamento = l.id_departamento
    LEFT JOIN public.complejos_turisticos AS c ON c.id_lugar = l.id_lugar
    LEFT JOIN public.atractivos_independientes AS a ON a.id_lugar = l.id_lugar
    LEFT JOIN LATERAL (
      SELECT url_imagen FROM public.imagenes_lugares
      WHERE id_lugar = l.id_lugar ORDER BY id_imagen LIMIT 1
    ) AS imagen ON TRUE
    WHERE ($1::text = '' OR strpos(lower(l.nombre), lower($1)) > 0
           OR strpos(lower(coalesce(l.descripcion, '')), lower($1)) > 0
           OR strpos(lower(l.municipio), lower($1)) > 0
           OR strpos(lower(d.nombre), lower($1)) > 0)
      AND ($2::integer IS NULL OR l.id_departamento = $2)
      AND ($3::text = '' OR strpos(lower(l.municipio), lower($3)) > 0)
      AND ($4::text = 'todos'
           OR ($4 = 'complejo' AND c.id_lugar IS NOT NULL)
           OR ($4 = 'atractivo' AND a.id_lugar IS NOT NULL)
           OR ($4 = 'otro' AND c.id_lugar IS NULL AND a.id_lugar IS NULL))
    ORDER BY ${orderBy[orden]}
  `, [q, departamento, municipio, tipo]);
  return rows;
}

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM lugares_turisticos');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM lugares_turisticos WHERE id_lugar = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { nombre, descripcion, id_departamento, municipio, direccion_exacta, maps_link } = data;
  const query = `
    INSERT INTO lugares_turisticos (nombre, descripcion, id_departamento, municipio, direccion_exacta, maps_link)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [nombre, descripcion, id_departamento, municipio, direccion_exacta, maps_link];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { nombre, descripcion, id_departamento, municipio, direccion_exacta, maps_link } = data;
  const query = `
    UPDATE lugares_turisticos
    SET nombre = $1, descripcion = $2, id_departamento = $3, municipio = $4, direccion_exacta = $5, maps_link = $6
    WHERE id_lugar = $7
    RETURNING *;
  `;
  const values = [nombre, descripcion, id_departamento, municipio, direccion_exacta, maps_link, id];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM lugares_turisticos WHERE id_lugar = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}
