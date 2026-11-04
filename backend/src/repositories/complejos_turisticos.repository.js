import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM complejos_turisticos');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM complejos_turisticos WHERE id_lugar = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { id_lugar, capacidad_locales, cobro_entrada, id_administrador, costo_entrada } = data;
  const query = `
    INSERT INTO complejos_turisticos (id_lugar, capacidad_locales, cobro_entrada, id_administrador, costo_entrada) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;
  `;
  const values = [
    id_lugar, 
    capacidad_locales || null, 
    cobro_entrada ?? false, 
    id_administrador || null, 
    costo_entrada || null
  ];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { capacidad_locales, cobro_entrada, id_administrador, costo_entrada } = data;
  const query = `
    UPDATE complejos_turisticos 
    SET capacidad_locales = $1, cobro_entrada = $2, id_administrador = $3, costo_entrada = $4 
    WHERE id_lugar = $5 
    RETURNING *;
  `;
  const values = [
    capacidad_locales, 
    cobro_entrada, 
    id_administrador || null, 
    costo_entrada, 
    id
  ];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM complejos_turisticos WHERE id_lugar = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}