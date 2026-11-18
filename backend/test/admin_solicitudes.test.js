import test from "node:test"
import assert from "node:assert/strict"
import jwt from "jsonwebtoken"
import app from "../src/app.js"
import { pool } from "../src/db/db.js"
import { signedAdminRequestDocument } from "../src/storage/uploads.service.js"

test("solo el administrador lista y decide solicitudes pendientes una vez", async () => {
  const previousQuery = pool.query
  const previousConnect = pool.connect
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = "admin-solicitudes-test"
  let estado = "Pendiente"
  const calls = []
  pool.query = async (sql, values = []) => {
    calls.push(sql)
    if (sql.includes("SELECT s.id_solicitud, s.id_usuario"))
      return {
        rows: [
          {
            id_solicitud: 9,
            nombre_negocio: "Hotel Sol",
            estado,
            categorias: [],
            documentos: [],
          },
        ],
      }
    if (sql.includes("AS existe")) return { rows: [{ existe: false }] }
    if (sql.includes("FROM public.propietarios_negocios WHERE id_usuario"))
      return { rows: [] }
    if (sql.includes("INSERT INTO public.propietarios_negocios"))
      return { rows: [{ id_propietario: 3 }] }
    if (sql.includes("INSERT INTO public.locales\n"))
      return { rows: [{ id_local: 4 }] }
    if (sql.includes("UPDATE public.solicitudes_registros")) {
      if (estado !== "Pendiente") return { rows: [] }
      estado = values[1]
      return { rows: [{ id_solicitud: 9, estado }] }
    }
    if (
      sql.includes(
        "SELECT * FROM public.solicitudes_registros WHERE id_solicitud",
      )
    )
      return {
        rows: [
          {
            id_solicitud: 9,
            estado,
            id_usuario: 7,
            codigo_ruc: "123",
            nombre_negocio: "Hotel Sol",
            id_departamento: 1,
            municipio: "Managua",
            direccion_exacta: "Centro",
            es_independiente: true,
          },
        ],
      }
    return { rows: [] }
  }
  pool.connect = async () => ({
    query: (...args) => pool.query(...args),
    release: () => {},
  })
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/solicitudes_registros`
  const auth = (rol) => ({
    Authorization: `Bearer ${jwt.sign({ id: 1, rol }, process.env.JWT_SECRET)}`,
  })
  try {
    const denied = await fetch(base, { headers: auth("Usuario") })
    assert.equal(denied.status, 403)
    const listed = await fetch(base, { headers: auth("Administrador") })
    assert.equal(listed.status, 200)
    assert.equal((await listed.json()).data[0].nombre_negocio, "Hotel Sol")
    const decision = await fetch(`${base}/9`, {
      method: "PATCH",
      headers: { ...auth("Administrador"), "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "Aprobada" }),
    })
    assert.equal(decision.status, 200)
    assert.equal((await decision.json()).data.estado, "Aprobada")
    assert.ok(
      calls.some((sql) =>
        sql.includes("INSERT INTO public.locales_comerciales"),
      ),
    )
    assert.ok(
      calls.some((sql) =>
        sql.includes("INSERT INTO public.locales_categorias"),
      ),
    )
    assert.ok(
      calls.findIndex((sql) =>
        sql.includes("INSERT INTO public.locales_comerciales"),
      ) <
        calls.findIndex((sql) =>
          sql.includes("UPDATE public.solicitudes_registros"),
        ),
    )
    const repeated = await fetch(`${base}/9`, {
      method: "PATCH",
      headers: { ...auth("Administrador"), "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "Rechazada" }),
    })
    assert.equal(repeated.status, 409)
    assert.equal(estado, "Aprobada")
  } finally {
    await new Promise((resolve) => server.close(resolve))
    pool.query = previousQuery
    pool.connect = previousConnect
    if (previousSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = previousSecret
  }
})

test("el enlace de un PDF administrativo exige rol y ruta de la solicitud", async () => {
  const path = "final/solicitudes/9/7/123e4567-e89b-12d3-a456-426614174000.pdf"
  const deps = {
    config: { documents: "documentos-privados" },
    client: {
      storage: {
        from: () => ({
          createSignedUrl: async () => ({
            data: { signedUrl: "https://example.com/documento.pdf" },
          }),
        }),
      },
    },
    business: {
      findRequestDocumentForAdmin: async () => ({
        url_archivo: path,
        id_usuario: 7,
      }),
    },
  }
  await assert.rejects(
    () => signedAdminRequestDocument({ rol: "Usuario" }, 9, 2, deps),
    { status: 403 },
  )
  assert.equal(
    (await signedAdminRequestDocument({ rol: "Administrador" }, 9, 2, deps))
      .expiresIn,
    60,
  )
  await assert.rejects(
    () => signedAdminRequestDocument({ rol: "Administrador" }, 10, 2, deps),
    { status: 404 },
  )
})
