import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM campanias_publicitarias');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM campanias_publicitarias WHERE id_campania = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { id_local, fecha_inicio, fecha_fin, monto_total, moneda, estado } = data;
  const query = `
    INSERT INTO campanias_publicitarias (id_local, fecha_inicio, fecha_fin, monto_total, moneda, estado) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *;
  `;
  const values = [
    id_local, 
    fecha_inicio, 
    fecha_fin, 
    monto_total, 
    moneda || 'NIO', 
    estado || 'Activa'
  ];
  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { id_local, fecha_inicio, fecha_fin, monto_total, moneda, estado } = data;
  const query = `
    UPDATE campanias_publicitarias 
    SET id_local = $1, fecha_inicio = $2, fecha_fin = $3, monto_total = $4, moneda = $5, estado = $6 
    WHERE id_campania = $7 
    RETURNING *;
  `;
  const values = [
    id_local, 
    fecha_inicio, 
    fecha_fin, 
    monto_total, 
    moneda || 'NIO', 
    estado, 
    id
  ];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM campanias_publicitarias WHERE id_campania = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}