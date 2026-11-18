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

export async function findPublicByLocal(idLocal, client = pool) {
  const { rows } = await client.query(
    `SELECT r.id_resena, r.calificacion, r.comentario, r.fecha_publicacion,
       r.respuesta_propietario, u.nombre_completo AS autor
     FROM public.resenas r
     JOIN public.usuarios u ON u.id_usuario = r.id_usuario
     WHERE r.id_local = $1 AND r.estado_moderacion = 'Aprobada'
     ORDER BY r.fecha_publicacion DESC, r.id_resena DESC`,
    [idLocal]
  )
  return rows
}

export async function create(data, client = pool) {
  const {
    id_usuario,
    id_local,
    calificacion,
    comentario,
    respuesta_propietario,
    estado_moderacion
  } = data;

  const query = `
    INSERT INTO resenas (
      id_usuario, id_local, calificacion, comentario,
      respuesta_propietario, estado_moderacion
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    id_usuario,
    id_local,
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
    id_usuario,
    id_local,
    calificacion,
    comentario,
    respuesta_propietario,
    estado_moderacion
  } = data;

  const query = `
    UPDATE resenas
    SET id_usuario = $1, id_local = $2, calificacion = $3,
        comentario = $4, respuesta_propietario = $5, estado_moderacion = $6
    WHERE id_resena = $7
    RETURNING *;
  `;

  const values = [
    id_usuario,
    id_local,
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
