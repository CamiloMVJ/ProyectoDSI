import { pool } from '../db/db.js';

export async function findAll(client = pool) {
    const { rows } = await client.query('SELECT * FROM administradores');
    return rows
}

export async function findOne(id, client = pool) {
    const { rows } = await client.query(
        'SELECT * FROM administradores WHERE id = $1', [id]
    )
    return rows[0]
}

export async function create(idUsuario, rol, client = pool) {
    const { rows } = await client
        .query('INSERT INTO administradores(id_usuario, rol) VALUES ($1, $2) RETURNING *', [idUsuario, rol])
    return rows[0]
}

export async function update(id, idUsuario, rol, client = pool) {
    const { rows } = await client
        .query('UPDATE administradores SET id_usuario = $1, rol = $2 WHERE id = $3 RETURNING *', [idUsuario, rol, id])
    return rows[0]
}

export async function remove(id, client = pool) {
    const { rows } = await client
        .query('DELETE FROM administradores WHERE id = $1 RETURNING *', [id]);
    return rows[0]
}
