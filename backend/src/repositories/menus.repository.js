import { pool } from "../db/db.js"

// Columnas permitidas del script SQL. Los valores se pasan como parámetros.
const fields = ["id_local", "titulo_menu", "descripcion", "esta_activo"]

function getEntries(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("data debe ser un objeto")
  }

  for (const field of Object.keys(data)) {
    if (!fields.includes(field)) {
      throw new TypeError(`Campo no permitido: ${field}`)
    }
  }

  // undefined: omitir el campo. null: enviar NULL explícitamente.
  return fields
    .filter((field) => data[field] !== undefined)
    .map((field) => [field, data[field]])
}

export async function findAll(client = pool) {
  const { rows } = await client.query(
    "SELECT * FROM public.menus ORDER BY id_menu",
  )

  return rows
}

export async function findOne(id, client = pool) {
  const { rows } = await client.query(
    "SELECT * FROM public.menus WHERE id_menu = $1",
    [id],
  )

  return rows[0] ?? null
}

export async function findPublicByLocal(localId, client = pool) {
  const { rows } = await client.query(
    `SELECT m.id_menu, m.titulo_menu, m.descripcion AS descripcion_menu,
      i.id_item, i.nombre_platillo, i.descripcion AS descripcion_item,
      i.precio, i.moneda, i.url_foto, i.es_vegetariano,
      cat.id_categoria_menu, cat.nombre AS categoria_nombre
     FROM public.menus m
     JOIN public.locales_comerciales c ON c.id_local = m.id_local
     LEFT JOIN public.items_menu i ON i.id_menu = m.id_menu AND i.esta_disponible = TRUE
     LEFT JOIN public.categorias_menu cat ON cat.id_categoria_menu = i.id_categoria_menu
     WHERE m.id_local = $1 AND m.esta_activo = TRUE AND c.esta_publicado = TRUE
     ORDER BY m.id_menu, cat.nombre NULLS LAST, i.id_item`,
    [localId],
  )
  const menus = new Map()
  for (const row of rows) {
    if (!menus.has(row.id_menu))
      menus.set(row.id_menu, {
        id_menu: row.id_menu,
        titulo_menu: row.titulo_menu,
        descripcion: row.descripcion_menu,
        categorias: [],
      })
    if (!row.id_item) continue
    const menu = menus.get(row.id_menu)
    let category = menu.categorias.find(
      (item) => item.id_categoria_menu === row.id_categoria_menu,
    )
    if (!category) {
      category = {
        id_categoria_menu: row.id_categoria_menu,
        nombre: row.categoria_nombre || "Otros",
        items: [],
      }
      menu.categorias.push(category)
    }
    category.items.push({
      id_item: row.id_item,
      nombre_platillo: row.nombre_platillo,
      descripcion: row.descripcion_item,
      precio: row.precio,
      moneda: row.moneda,
      url_foto: row.url_foto,
      es_vegetariano: row.es_vegetariano,
    })
  }
  return [...menus.values()]
}

export async function create(data, client = pool) {
  const entries = getEntries(data)
  const columns = entries.map(([field]) => field).join(", ")
  const placeholders = entries.map((_, index) => `$${index + 1}`).join(", ")
  const values = entries.map(([, value]) => value)

  // Omitir campos conserva los DEFAULT definidos en PostgreSQL.
  const sql = entries.length
    ? `INSERT INTO public.menus (${columns}) VALUES (${placeholders}) RETURNING *`
    : "INSERT INTO public.menus DEFAULT VALUES RETURNING *"

  const { rows } = await client.query(sql, values)

  return rows[0]
}

export async function update(id, data, client = pool) {
  const entries = getEntries(data)

  if (entries.length === 0) {
    throw new TypeError("Debés enviar al menos un campo para actualizar")
  }

  const assignments = entries
    .map(([field], index) => `${field} = $${index + 1}`)
    .join(", ")

  const values = entries.map(([, value]) => value)
  values.push(id)

  const { rows } = await client.query(
    `UPDATE public.menus SET ${assignments} WHERE id_menu = $${values.length} RETURNING *`,
    values,
  )

  return rows[0] ?? null
}

export async function remove(id, client = pool) {
  const { rowCount } = await client.query(
    "DELETE FROM public.menus WHERE id_menu = $1",
    [id],
  )

  return rowCount > 0
}
