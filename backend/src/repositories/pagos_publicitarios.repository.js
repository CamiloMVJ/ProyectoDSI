import { pool } from '../db/db.js';

export async function findAll(client = pool) {
  const { rows } = await client.query('SELECT * FROM pagos_publicidad');
  return rows;
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    'SELECT * FROM pagos_publicidad WHERE id_pago = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(data, client = pool) {
  const { 
    id_campania, 
    id_dueno, 
    monto, 
    moneda, 
    metodo_pago, 
    numero_referencia, 
    comprobante_url, 
    estado_pago 
  } = data;

  const query = `
    INSERT INTO pagos_publicidad (
      id_campania, id_dueno, monto, moneda,
      metodo_pago, numero_referencia, comprobante_url, estado_pago
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    id_campania, 
    id_dueno || null, 
    monto, 
    moneda || 'NIO', 
    metodo_pago || null, 
    numero_referencia || null, 
    comprobante_url || null, 
    estado_pago || 'Pendiente'
  ];

  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function update(id, data, client = pool) {
  const { 
    id_campania, 
    id_dueno, 
    monto, 
    moneda, 
    metodo_pago, 
    numero_referencia, 
    comprobante_url, 
    estado_pago 
  } = data;

  const query = `
    UPDATE pagos_publicidad 
    SET id_campania = $1, id_dueno = $2, monto = $3,
        moneda = $4, metodo_pago = $5, numero_referencia = $6,
        comprobante_url = $7, estado_pago = $8
    WHERE id_pago = $9
    RETURNING *;
  `;

  const values = [
    id_campania, 
    id_dueno || null, 
    monto, 
    moneda || 'NIO', 
    metodo_pago, 
    numero_referencia, 
    comprobante_url, 
    estado_pago, 
    id
  ];

  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

export async function remove(id, client = pool) {
  const { rows } = await client.query(
    'DELETE FROM pagos_publicidad WHERE id_pago = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}
