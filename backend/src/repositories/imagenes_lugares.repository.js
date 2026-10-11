import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM imagenes_lugares');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM imagenes_lugares WHERE id_imagen = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { id_lugar, url_imagen, descripcion } = data;
  const query = `
    INSERT INTO imagenes_lugares (id_lugar, url_imagen, descripcion) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [id_lugar, url_imagen, descripcion || null];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { id_lugar, url_imagen, descripcion } = data;
  const query = `
    UPDATE imagenes_lugares 
    SET id_lugar = $1, url_imagen = $2, descripcion = $3 
    WHERE id_imagen = $4 
    RETURNING *;
  `;
  const values = [id_lugar, url_imagen, descripcion || null, id];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM imagenes_lugares WHERE id_imagen = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}