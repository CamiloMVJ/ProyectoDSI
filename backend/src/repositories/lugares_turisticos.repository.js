import { pool } from '../db/db.js';

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
  const { nombre, descripcion, departamento, municipio, direccion_exacta, maps_link } = data;
  const query = `
    INSERT INTO lugares_turisticos (nombre, descripcion, departamento, municipio, direccion_exacta, maps_link) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *;
  `;
  const values = [nombre, descripcion, departamento, municipio, direccion_exacta, maps_link];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { nombre, descripcion, departamento, municipio, direccion_exacta, maps_link } = data;
  const query = `
    UPDATE lugares_turisticos 
    SET nombre = $1, descripcion = $2, departamento = $3, municipio = $4, direccion_exacta = $5, maps_link = $6 
    WHERE id_lugar = $7 
    RETURNING *;
  `;
  const values = [nombre, descripcion, departamento, municipio, direccion_exacta, maps_link, id];
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