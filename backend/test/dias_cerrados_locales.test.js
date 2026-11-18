import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'

test('el propietario consulta, crea y elimina únicamente cierres de su local', async () => {
  const originalQuery = pool.query
  const originalConnect = pool.connect
  const originalSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'dias-cerrados-test'
  const calls = []
  const dias = new Map()
  const min = '2026-11-17'
  const max = '2027-01-16'
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values })
    if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') return { rows: [] }
    if (sql.startsWith('SELECT l.id_local FROM public.locales l')) {
      const own = values[0] === 5 && (values[1] === true || values[2] === 2)
      return { rows: own ? [{ id_local: 5 }] : [] }
    }
    if (sql.includes('AS fecha_minima')) return { rows: [{ fecha_minima: min, fecha_maxima: max }] }
    if (sql.includes('FROM public.dias_cerrados_locales') && sql.includes('ORDER BY fecha'))
      return { rows: [...dias.values()] }
    if (sql.includes('INSERT INTO public.dias_cerrados_locales')) {
      if ([...dias.values()].some(dia => dia.fecha === values[1])) {
        const error = new Error('unique violation')
        error.code = '23505'
        throw error
      }
      const dia = { id_cierre: 8, id_local: values[0], fecha: values[1], motivo: values[2] }
      dias.set(8, dia)
      return { rows: [dia] }
    }
    if (sql.includes('DELETE FROM public.dias_cerrados_locales')) {
      const allowed = values[0] === 5 && (values[1] === true || values[2] === 2)
      const existing = allowed ? dias.get(values[3]) : null
      if (existing) dias.delete(values[3])
      return { rows: existing ? [{ id_cierre: values[3] }] : [] }
    }
    throw new Error(`Consulta inesperada: ${sql}`)
  }
  pool.connect = async () => ({ query: (...args) => pool.query(...args), release: () => {} })
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/gestion-establecimientos/5/dias-cerrados`
  const auth = (id, rol = 'Propietario') => ({ Authorization: `Bearer ${jwt.sign({ id, rol }, process.env.JWT_SECRET)}` })
  const post = (body, id = 2, rol = 'Propietario') => fetch(base, {
    method: 'POST', headers: { ...auth(id, rol), 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  try {
    assert.equal((await fetch(base)).status, 401)
    assert.equal((await fetch(base, { headers: auth(3) })).status, 404)
    const initial = await fetch(base, { headers: auth(2, 'Usuario') })
    assert.equal(initial.status, 200)
    assert.deepEqual((await initial.json()).data, { dias_cerrados: [], fecha_minima: min, fecha_maxima: max })
    assert.equal((await post({ fecha: '2026-02-30' })).status, 400)
    assert.equal((await post({ fecha: '2026-11-16' })).status, 400)
    assert.equal((await post({ fecha: '2027-01-17' })).status, 400)
    assert.equal((await post({ fecha: '2026-12-24', motivo: 'Inventario' }, 3)).status, 404)
    const created = await post({ fecha: '2026-12-24', motivo: 'Inventario' })
    assert.equal(created.status, 201)
    assert.equal((await created.json()).data.motivo, 'Inventario')
    assert.equal((await post({ fecha: '2026-12-24' })).status, 409)
    assert.equal((await fetch(base, { headers: auth(2) }).then(response => response.json())).data.dias_cerrados.length, 1)
    assert.equal((await fetch(`${base}/8`, { method: 'DELETE', headers: auth(3) })).status, 404)
    assert.equal((await fetch(`${base}/8`, { method: 'DELETE', headers: auth(2) })).status, 200)
    assert.equal((await fetch(`${base}/8`, { method: 'DELETE', headers: auth(2) })).status, 404)
    assert.equal(calls.filter(call => call.sql.includes('INSERT INTO public.dias_cerrados_locales')).length, 2)
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = originalQuery
    pool.connect = originalConnect
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  }
})
