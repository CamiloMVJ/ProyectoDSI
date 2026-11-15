import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'

test('la solicitud usa la cuenta autenticada y guarda solo datos del negocio', async () => {
  const previousQuery = pool.query
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'solicitudes-test-secret'
  const calls = []
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values })
    if (sql.includes('FROM public.departamentos')) return { rows: [{ id_departamento: 10, nombre: 'Managua' }] }
    if (sql.includes('INSERT INTO public.solicitudes_registros')) {
      return { rows: [{ id_solicitud: 4, id_usuario: 7, estado: 'Pendiente' }] }
    }
    return { rows: [] }
  }
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/solicitudes_registros`
  const token = jwt.sign({ id: 7, rol: 'Usuario' }, process.env.JWT_SECRET)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const data = { nombre_negocio: 'Hotel Sol', codigo_ruc: '12345', municipio: 'Managua', direccion_exacta: 'Centro', id_departamento: 10 }

  try {
    assert.equal((await fetch(base, { method: 'POST', body: JSON.stringify(data) })).status, 401)
    const response = await fetch(base, { method: 'POST', headers, body: JSON.stringify({ ...data, id_usuario: 999, estado: 'Aprobada' }) })
    assert.equal(response.status, 201)
    assert.deepEqual((await response.json()).data, { id_solicitud: 4, id_usuario: 7, estado: 'Pendiente' })
    const insertion = calls.find(call => call.sql.includes('INSERT INTO public.solicitudes_registros'))
    assert.match(insertion.sql, /id_usuario/)
    assert.doesNotMatch(insertion.sql, /estado/)
    assert.ok(insertion.values.includes(7))
    assert.ok(!insertion.values.includes(999))

    const invalid = await fetch(base, { method: 'POST', headers, body: JSON.stringify({ ...data, id_departamento: 0 }) })
    assert.equal(invalid.status, 400)
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = previousQuery
    if (previousSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = previousSecret
  }
})
