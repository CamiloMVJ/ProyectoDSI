import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'

test('favoritos solo consulta y elimina registros del usuario del token', async () => {
  const previousQuery = pool.query
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'favorites-test-secret'
  const calls = []
  pool.query = async (sql, values) => {
    calls.push({ sql, values })
    if (sql.includes('SELECT id_local FROM public.locales')) return { rows: [{ id_local: 9 }] }
    if (sql.includes('INSERT INTO public.favoritos')) return { rows: [{ id_favorito: 3, id_usuario: values[0], id_local: values[1] }] }
    if (sql.includes('DELETE FROM public.favoritos')) return { rows: [{ id_favorito: values[0] }] }
    return { rows: [] }
  }
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/favoritos`
  const token = jwt.sign({ id: 7, rol: 'Usuario' }, process.env.JWT_SECRET)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  try {
    assert.equal((await fetch(base)).status, 401)
    assert.equal((await fetch(base, { headers })).status, 200)
    assert.deepEqual(calls.at(-1).values, [7])

    const created = await fetch(base, { method: 'POST', headers, body: JSON.stringify({ id_local: 9 }) })
    assert.equal(created.status, 201)
    assert.deepEqual(calls.at(-1).values, [7, 9])

    const spoofed = await fetch(base, { method: 'POST', headers, body: JSON.stringify({ id_local: 9, id_usuario: 99 }) })
    assert.equal(spoofed.status, 400)

    const deleted = await fetch(`${base}/3`, { method: 'DELETE', headers })
    assert.equal(deleted.status, 200)
    assert.deepEqual(calls.at(-1).values, [3, 7])
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = previousQuery
    if (previousSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = previousSecret
  }
})
