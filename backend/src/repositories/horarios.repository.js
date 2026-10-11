import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM horarios');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM horarios WHERE id_horario = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { id_lugar, dia_semama, hora_apertura, hora_cierre, es_feriado } = data;
  const query = `
    INSERT INTO horarios (id_lugar, dia_semama, hora_apertura, hora_cierre, es_feriado) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;
  `;
  const values = [id_lugar, dia_semama, hora_apertura, hora_cierre, es_feriado ?? false];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { id_lugar, dia_semama, hora_apertura, hora_cierre, es_feriado } = data;
  const query = `
    UPDATE horarios 
    SET id_lugar = $1, dia_semama = $2, hora_apertura = $3, hora_cierre = $4, es_feriado = $5 
    WHERE id_horario = $6 
    RETURNING *;
  `;
  const values = [id_lugar, dia_semama, hora_apertura, hora_cierre, es_feriado, id];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM horarios WHERE id_horario = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}