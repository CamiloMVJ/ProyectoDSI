import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM atractivos_independientes');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM atractivos_independientes WHERE id_lugar = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { id_lugar, tipo_acceso, entidad_encargada, id_administrador, normativa_visitantes } = data;
  const query = `
    INSERT INTO atractivos_independientes (id_lugar, tipo_acceso, entidad_encargada, id_administrador, normativa_visitantes) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;
  `;
  const values = [id_lugar, tipo_acceso, entidad_encargada, id_administrador || null, normativa_visitantes];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { tipo_acceso, entidad_encargada, id_administrador, normativa_visitantes } = data;
  const query = `
    UPDATE atractivos_independientes 
    SET tipo_acceso = $1, entidad_encargada = $2, id_administrador = $3, normativa_visitantes = $4 
    WHERE id_lugar = $5 
    RETURNING *;
  `;
  const values = [tipo_acceso, entidad_encargada, id_administrador || null, normativa_visitantes, id];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM atractivos_independientes WHERE id_lugar = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}