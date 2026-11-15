import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'

test('categorías de lugares y locales usan la tabla compartida y validan el tipo de padre', async () => {
  const originalQuery = pool.query
  const originalSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'categories-test-secret'
  const calls = []
  pool.query = async (sql, values) => {
    calls.push({ sql, values })
    if (sql.includes('FROM public.lugares_turisticos AS l')) return { rows: values[0] === 10 ? [{ id_lugar: 10 }] : [] }
    if (sql.includes('FROM public.locales_comerciales AS c')) return { rows: values[0] === 20 ? [{ id_local: 20 }] : [] }
    if (sql.includes('FROM public.locales WHERE id_local')) return { rows: values[0] === 10 || values[0] === 20 ? [{ id_local: values[0] }] : [] }
    if (sql.includes('FROM categorias WHERE id_categoria')) return { rows: [{ id_categoria: values[0], nombre: 'Restaurante' }] }
    if (sql.includes('INSERT INTO public.locales_categorias')) return { rows: [{ id_local: values[0], id_categoria: values[1] }] }
    if (sql.includes('DELETE FROM public.locales_categorias')) return { rows: [{ id_local: values[0], id_categoria: values[1] }] }
    return { rows: [{ id_categoria: 3, nombre: 'Restaurante' }] }
  }
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api`
  const admin = jwt.sign({ id: 1, rol: 'Administrador' }, process.env.JWT_SECRET)
  const headers = { Authorization: `Bearer ${admin}`, 'Content-Type': 'application/json' }

  try {
    const place = await fetch(`${base}/lugares_turisticos/10/categorias`)
    assert.equal(place.status, 200)
    assert.equal((await place.json()).data[0].nombre, 'Restaurante')

    const all = await fetch(`${base}/locales_categorias`)
    assert.equal(all.status, 200)
    assert.match(calls.at(-1).sql, /FROM public\.locales_categorias AS lc/)

    const wrongType = await fetch(`${base}/lugares_turisticos/20/categorias`)
    assert.equal(wrongType.status, 404)

    const local = await fetch(`${base}/locales_comerciales/20/categorias`, {
      method: 'POST', headers, body: JSON.stringify({ id_categoria: 3 })
    })
    assert.equal(local.status, 201)
    assert.deepEqual(calls.at(-1).values, [20, 3])

    const shared = await fetch(`${base}/locales_categorias`, {
      method: 'POST', headers, body: JSON.stringify({ id_local: 10, id_categoria: 3 })
    })
    assert.equal(shared.status, 201)
    assert.deepEqual(calls.at(-1).values, [10, 3])

    const denied = await fetch(`${base}/locales_comerciales/20/categorias/3`, { method: 'DELETE' })
    assert.equal(denied.status, 401)

    const deleted = await fetch(`${base}/locales_comerciales/20/categorias/3`, { method: 'DELETE', headers })
    assert.equal(deleted.status, 200)
    assert.deepEqual(calls.at(-1).values, [20, 3])
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = originalQuery
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  }
})
