import test from "node:test"
import assert from "node:assert/strict"
import app from "../src/app.js"
import { pool } from "../src/db/db.js"

test("el menú público agrupa por categoría y consulta solo menús activos con ítems disponibles", async () => {
  const originalQuery = pool.query
  let query
  pool.query = async (sql, values) => {
    query = { sql, values }
    return {
      rows: [
        {
          id_menu: 1,
          titulo_menu: "Carta",
          descripcion_menu: "Almuerzos",
          id_item: 8,
          nombre_platillo: "Gallo pinto",
          descripcion_item: "Con queso",
          precio: "120.00",
          moneda: "NIO",
          url_foto: "https://example.com/foto.jpg",
          es_vegetariano: true,
          id_categoria_menu: 2,
          categoria_nombre: "Plato Fuerte",
        },
        {
          id_menu: 1,
          titulo_menu: "Carta",
          descripcion_menu: "Almuerzos",
          id_item: 9,
          nombre_platillo: "Jugo",
          descripcion_item: null,
          precio: "45.00",
          moneda: "NIO",
          url_foto: null,
          es_vegetariano: true,
          id_categoria_menu: 3,
          categoria_nombre: "Bebida",
        },
      ],
    }
  }
  const server = app.listen(0)
  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/api/locales_comerciales/5/menus`,
    )
    assert.equal(response.status, 200)
    const menus = (await response.json()).data
    assert.equal(menus.length, 1)
    assert.deepEqual(
      menus[0].categorias.map((category) => category.nombre),
      ["Plato Fuerte", "Bebida"],
    )
    assert.equal(menus[0].categorias[0].items[0].es_vegetariano, true)
    assert.match(query.sql, /m\.esta_activo = TRUE/)
    assert.match(query.sql, /i\.esta_disponible = TRUE/)
    assert.match(query.sql, /c\.esta_publicado = TRUE/)
    assert.deepEqual(query.values, [5])
  } finally {
    await new Promise((resolve) => server.close(resolve))
    pool.query = originalQuery
  }
})
