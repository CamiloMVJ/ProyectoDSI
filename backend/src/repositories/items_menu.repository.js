import { pool } from '../db/db.js'

const fields = [
    'id_menu',
    'nombre_platillo',
    'descripcion',
    'precio',
    'moneda',
    'url_foto',
    'es_vegetariano',
    'esta_disponible'
]

function getEntries(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new TypeError('data debe ser un objeto')
    }

    for (const field of Object.keys(data)) {
        if (!fields.includes(field)) {
            throw new TypeError(`Campo no permitido: ${field}`)
        }
    }

    // undefined omite el campo; null envía NULL.
    return fields
        .filter((field) => data[field] !== undefined)
        .map((field) => [field, data[field]])
}

export async function findAll(client = pool) {
    const { rows } = await client.query(
        `SELECT * FROM public.items_menu ORDER BY id_item`
    )

    return rows
}

export async function findOne(id, client = pool) {
    const { rows } = await client.query(
        `SELECT * FROM public.items_menu WHERE id_item = $1`,
        [id]
    )

    return rows[0] ?? null
}

export async function create(data, client = pool) {
    const entries = getEntries(data)

    const columns = entries
        .map(([field]) => field)
        .join(', ')

    const placeholders = entries
        .map((_, index) => `$${index + 1}`)
        .join(', ')

    const values = entries.map(([, value]) => value)

    // Los campos omitidos conservan sus valores DEFAULT.
    const sql = entries.length
        ? `INSERT INTO public.items_menu (${columns})
       VALUES (${placeholders})
       RETURNING *`
        : `INSERT INTO public.items_menu DEFAULT VALUES
       RETURNING *`

    const { rows } = await client.query(sql, values)

    return rows[0]
}

export async function update(id, data, client = pool) {
    const entries = getEntries(data)

    if (entries.length === 0) {
        throw new TypeError(
            'Debés enviar al menos un campo para actualizar'
        )
    }

    const assignments = entries
        .map(([field], index) => `${field} = $${index + 1}`)
        .join(', ')

    const values = entries.map(([, value]) => value)
    values.push(id)

    const { rows } = await client.query(
        `UPDATE public.items_menu
     SET ${assignments}
     WHERE id_item = $${values.length}
     RETURNING
       id_item, id_menu, nombre_platillo, descripcion,
       precio, moneda, url_foto, es_vegetariano, esta_disponible`,
        values
    )

    return rows[0] ?? null
}

export async function remove(id, client = pool) {
    const { rowCount } = await client.query(
        'DELETE FROM public.items_menu WHERE id_item = $1',
        [id]
    )

    return rowCount > 0
}