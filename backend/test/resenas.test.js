import test from "node:test"
import assert from "node:assert/strict"
import jwt from "jsonwebtoken"
import app from "../src/app.js"
import { pool } from "../src/db/db.js"

test("reseñas: usuario publica con su identidad y solo el dueño responde", async () => {
  const previousQuery = pool.query
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = "resenas-test-secret"
  const calls = []
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values })
    if (sql.includes("SELECT id_local FROM public.locales_comerciales")) {
      return { rows: values[0] === 5 ? [{ id_local: 5 }] : [] }
    }
    if (sql.includes("AS owns_local")) {
      return { rows: [{ owns_local: values[0] === 5 && values[1] === 7 }] }
    }
    if (sql.includes("INSERT INTO public.resenas")) {
      return {
        rows: [
          {
            id_resena: 3,
            id_usuario: values[0],
            id_local: values[1],
            calificacion: values[2],
            comentario: values[3],
            estado_moderacion: "Aprobada",
          },
        ],
      }
    }
    if (sql.includes("UPDATE public.resenas r SET respuesta_propietario")) {
      return {
        rows:
          values[1] === 7
            ? [{ id_resena: 3, id_local: 5, respuesta_propietario: values[2] }]
            : [],
      }
    }
    if (sql.includes("r.estado_moderacion =")) {
      return {
        rows: [
          {
            id_resena: 3,
            calificacion: 5,
            comentario: "Excelente",
            autor: "Cliente",
          },
        ],
      }
    }
    return { rows: [] }
  }
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/resenas`
  const auth = (id, rol) => ({
    Authorization: `Bearer ${jwt.sign({ id, rol }, process.env.JWT_SECRET)}`,
    "Content-Type": "application/json",
  })
  const review = { id_local: 5, calificacion: 5, comentario: "Excelente" }
  try {
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        })
      ).status,
      401,
    )
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: auth(1, "Administrador"),
          body: JSON.stringify(review),
        })
      ).status,
      403,
    )
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: auth(12, "Usuario"),
          body: JSON.stringify({ ...review, id_usuario: 7 }),
        })
      ).status,
      400,
    )
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: auth(12, "Usuario"),
          body: JSON.stringify({ ...review, calificacion: 6 }),
        })
      ).status,
      400,
    )
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: auth(12, "Usuario"),
          body: JSON.stringify({ ...review, id_local: 6 }),
        })
      ).status,
      404,
    )
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: auth(7, "Propietario"),
          body: JSON.stringify(review),
        })
      ).status,
      403,
    )

    const created = await fetch(base, {
      method: "POST",
      headers: auth(12, "Usuario"),
      body: JSON.stringify(review),
    })
    assert.equal(created.status, 201)
    assert.equal((await created.json()).data.id_usuario, 12)
    assert.deepEqual(
      calls.find((call) => call.sql.includes("INSERT INTO public.resenas"))
        .values,
      [12, 5, 5, "Excelente"],
    )
    assert.ok(
      calls.some((call) =>
        call.sql.includes("VALUES ($1, $2, $3, $4, 'Aprobada')"),
      ),
    )

    const permissions = await fetch(`${base}/local/5/permisos`, {
      headers: auth(7, "Propietario"),
    })
    assert.equal((await permissions.json()).data.puede_responder, true)
    const otherPermissions = await fetch(`${base}/local/5/permisos`, {
      headers: auth(8, "Propietario"),
    })
    assert.equal((await otherPermissions.json()).data.puede_responder, false)
    assert.equal(
      (
        await fetch(`${base}/3/respuesta`, {
          method: "PATCH",
          headers: auth(12, "Usuario"),
          body: JSON.stringify({ respuesta_propietario: "Gracias" }),
        })
      ).status,
      403,
    )
    assert.equal(
      (
        await fetch(`${base}/3/respuesta`, {
          method: "PATCH",
          headers: auth(8, "Propietario"),
          body: JSON.stringify({ respuesta_propietario: "Gracias" }),
        })
      ).status,
      404,
    )
    const answered = await fetch(`${base}/3/respuesta`, {
      method: "PATCH",
      headers: auth(7, "Propietario"),
      body: JSON.stringify({ respuesta_propietario: "Gracias" }),
    })
    assert.equal(answered.status, 200)
    assert.equal((await answered.json()).data.respuesta_propietario, "Gracias")
    assert.ok(
      calls.some(
        (call) =>
          call.sql.includes("r.estado_moderacion = 'Aprobada'") &&
          call.sql.includes("p.id_usuario = $2"),
      ),
    )

    const publicList = await fetch(`${base}/local/5`)
    assert.equal(publicList.status, 200)
    assert.equal((await publicList.json()).data.length, 1)
    assert.equal((await fetch(base)).status, 401)
  } finally {
    await new Promise((resolve) => server.close(resolve))
    pool.query = previousQuery
    if (previousSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = previousSecret
  }
})
