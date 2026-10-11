import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM resenas');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM resenas WHERE id_resena = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { 
    id_turista, 
    id_lugar, 
    calificacion, 
    comentario, 
    respuesta_propietario, 
    estado_moderacion 
  } = data;

  const query = `
    INSERT INTO resenas (
      id_turista, id_lugar, calificacion, comentario, 
      respuesta_propietario, estado_moderacion
    ) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *;
  `;

  const values = [
    id_turista, 
    id_lugar, 
    calificacion, 
    comentario || null, 
    respuesta_propietario || null, 
    estado_moderacion || 'Pendiente'
  ];

  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { 
    id_turista, 
    id_lugar, 
    calificacion, 
    comentario, 
    respuesta_propietario, 
    estado_moderacion 
  } = data;

  const query = `
    UPDATE resenas 
    SET id_turista = $1, id_lugar = $2, calificacion = $3, 
        comentario = $4, respuesta_propietario = $5, estado_moderacion = $6 
    WHERE id_resena = $7 
    RETURNING *;
  `;

  const values = [
    id_turista, 
    id_lugar, 
    calificacion, 
    comentario || null, 
    respuesta_propietario || null, 
    estado_moderacion || 'Pendiente', 
    id
  ];

  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM resenas WHERE id_resena = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}