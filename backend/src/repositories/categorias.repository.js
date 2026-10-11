import { pool } from '../db/db.js'

export async function findAll(client = pool) {
    const { rows } = await client.query(
        'SELECT * FROM categorias ORDER BY id_categoria'
    )
    return rows
}

export async function findOne(id, client = pool) {
    const { rows } = await client.query(
        'SELECT * FROM categorias WHERE id_categoria = $1',
        [id]
    )
    return rows[0] || null;
}

export async function create({ nombre, descripcion = null, icono_url = null, client = pool }) {
    const { rows } = await client.query(
        `INSERT INTO categorias (nombre, descripcion, icono_url)
		 VALUES ($1, $2)
		 RETURNING *`,
        [nombre, descripcion, icono_url]
    )
    return rows[0]
}

export async function update(id, { nombre, descripcion = null, icono_url = null, client = pool }) {
    const { rows } = await client.query(
        `UPDATE categorias
		 SET nombre = $1, descripcion = $2, icono_url = $3
		 WHERE id_categoria = $4
		 RETURNING *`,
        [nombre, descripcion, icono_url, id]
    )
    return rows[0] || null
}

export async function remove(id, client = pool) {
    const { rows } = await client.query(
        'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *',
        [id]
    )
    return rows[0] || null
}

