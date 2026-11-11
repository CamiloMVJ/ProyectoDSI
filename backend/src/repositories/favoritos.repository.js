import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM favoritos');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM favoritos WHERE id_favorito = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { id_usuario, id_local } = data;
  const query = `
    INSERT INTO favoritos (id_usuario, id_local)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [id_usuario, id_local];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { id_usuario, id_local } = data;
  const query = `
    UPDATE favoritos
    SET id_usuario = $1, id_local = $2
    WHERE id_favorito = $3
    RETURNING *;
  `;
  const values = [id_usuario, id_local, id];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM favoritos WHERE id_favorito = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}
