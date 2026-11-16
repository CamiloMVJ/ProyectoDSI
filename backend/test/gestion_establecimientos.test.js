import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'

test('administradores ven todo y cada dueño solo gestiona sus locales', async () => {
  const previousQuery = pool.query
  const previousConnect = pool.connect
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'gestion-establecimientos-test'
  const calls = []
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values })
    if (sql.includes('SELECT c.id_local, c.codigo_ruc')) {
      const locales = [
        { id_local: 5, id_usuario: 2, nombre: 'Hotel Sol', codigo_ruc: '123', esta_publicado: true, propietario: 'Ana', servicios: [] },
        { id_local: 6, id_usuario: 3, nombre: 'Hotel Luna', codigo_ruc: '456', esta_publicado: true, propietario: 'Luis', servicios: [] },
      ]
      return { rows: locales.filter(local => (sql.includes('WHERE c.id_local = $1') ? local.id_local === values[0] : true) && (sql.includes('p.id_usuario = $2') ? values[0] || local.id_usuario === values[1] : true)) }
    }
    if (sql.includes('FOR UPDATE OF c')) return { rows: values[1] || (values[0] === 5 ? values[2] === 2 : values[2] === 3) ? [{ id_local: values[0] }] : [] }
    if (sql.includes('FROM public.departamentos')) return { rows: [{ id_departamento: 1 }] }
    return { rows: [], rowCount: 1 }
  }
  pool.connect = async () => ({ query: (...args) => pool.query(...args), release: () => {} })
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/gestion-establecimientos`
  const auth = (rol, id = 1) => ({ Authorization: `Bearer ${jwt.sign({ id, rol }, process.env.JWT_SECRET)}` })
  const body = {
    nombre: 'Hotel Sol', codigo_ruc: '123', razon_social: null, descripcion: null,
    id_departamento: 1, municipio: 'Managua', direccion_exacta: 'Centro', maps_link: null,
    telefono_contacto: null, correo_contacto: null, sitio_web: null,
    es_independiente: true, id_complejo_padre: null, esta_publicado: true, servicios: [],
  }
  try {
    assert.equal((await fetch(base)).status, 401)
    const list = await fetch(base, { headers: auth('Administrador') })
    assert.equal(list.status, 200)
    assert.equal((await list.clone().json()).data.length, 2)
    assert.equal((await list.json()).data[0].propietario, 'Ana')
    const ownList = await fetch(base, { headers: auth('Propietario', 2) })
    assert.deepEqual((await ownList.json()).data.map(local => local.id_local), [5])
    const otherList = await fetch(base, { headers: auth('Usuario', 4) })
    assert.deepEqual((await otherList.json()).data, [])
    const updatesBefore = calls.filter(call => call.sql.includes('UPDATE public.locales SET')).length
    assert.equal((await fetch(`${base}/6`, { method: 'PUT', headers: { ...auth('Propietario', 2), 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).status, 404)
    assert.equal(calls.filter(call => call.sql.includes('UPDATE public.locales SET')).length, updatesBefore)
    const ownSaved = await fetch(`${base}/5`, { method: 'PUT', headers: { ...auth('Usuario', 2), 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    assert.equal(ownSaved.status, 200)
    const saved = await fetch(`${base}/5`, { method: 'PUT', headers: { ...auth('Administrador'), 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    assert.equal(saved.status, 200)
    assert.equal((await saved.json()).data.id_local, 5)
    assert.ok(calls.some(call => call.sql.includes('UPDATE public.locales SET')))
    assert.ok(calls.some(call => call.sql.includes('UPDATE public.locales_comerciales SET')))
    assert.ok(calls.some(call => call.sql.includes('UPDATE public.servicios SET esta_disponible = FALSE')))
    assert.ok(calls.some(call => call.sql === 'COMMIT'))
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = previousQuery
    pool.connect = previousConnect
    if (previousSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = previousSecret
  }
})
