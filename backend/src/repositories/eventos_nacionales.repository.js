import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM eventos_nacionales');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM eventos_nacionales WHERE id_evento = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { 
    titulo, 
    descripcion, 
    fecha_inicio, 
    fecha_fin, 
    hora_inicio, 
    hora_fin, 
    departamento, 
    municipio, 
    direccion_referencia, 
    tipo_evento, 
    costo_entrada, 
    es_gratuito, 
    es_anual_recurrente, 
    id_lugar_asociado, 
    estado 
  } = data;

  const query = `
    INSERT INTO eventos_nacionales (
      titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin, 
      departamento, municipio, direccion_referencia, tipo_evento, 
      costo_entrada, es_gratuito, es_anual_recurrente, id_lugar_asociado, estado
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
    RETURNING *;
  `;

  const values = [
    titulo, 
    descripcion || null, 
    fecha_inicio, 
    fecha_fin, 
    hora_inicio || null, 
    hora_fin || null, 
    departamento, 
    municipio, 
    direccion_referencia || null, 
    tipo_evento || null, 
    costo_entrada || null, 
    es_gratuito ?? false, 
    es_anual_recurrente ?? false, 
    id_lugar_asociado || null, 
    estado || 'Programado'
  ];

  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { 
    titulo, 
    descripcion, 
    fecha_inicio, 
    fecha_fin, 
    hora_inicio, 
    hora_fin, 
    departamento, 
    municipio, 
    direccion_referencia, 
    tipo_evento, 
    costo_entrada, 
    es_gratuito, 
    es_anual_recurrente, 
    id_lugar_asociado, 
    estado 
  } = data;

  const query = `
    UPDATE eventos_nacionales 
    SET titulo = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4, 
        hora_inicio = $5, hora_fin = $6, departamento = $7, municipio = $8, 
        direccion_referencia = $9, tipo_evento = $10, costo_entrada = $11, 
        es_gratuito = $12, es_anual_recurrente = $13, id_lugar_asociado = $14, estado = $15 
    WHERE id_evento = $16 
    RETURNING *;
  `;

  const values = [
    titulo, 
    descripcion, 
    fecha_inicio, 
    fecha_fin, 
    hora_inicio, 
    hora_fin, 
    departamento, 
    municipio, 
    direccion_referencia, 
    tipo_evento, 
    costo_entrada, 
    es_gratuito, 
    es_anual_recurrente, 
    id_lugar_asociado || null, 
    estado, 
    id
  ];

  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM eventos_nacionales WHERE id_evento = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}