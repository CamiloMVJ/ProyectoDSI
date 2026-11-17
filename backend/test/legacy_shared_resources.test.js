import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'

test('rutas compartidas respetan propiedad comercial y reservan lugares turísticos a administradores', async () => {
  const originalQuery = pool.query
  const originalSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'shared-resources-test'
  pool.query = async (sql, values = []) => {
    if (sql.startsWith('SELECT id_local FROM public.locales WHERE'))
      return { rows: [{ id_local: values[0] }] }
    if (sql.startsWith('SELECT l.id_local FROM public.locales l')) {
      const allowed = (values[0] === 5 && values[1] === true) ||
        (values[0] === 6 && (values[1] === true || values[2] === 2))
      return { rows: allowed ? [{ id_local: values[0] }] : [] }
    }
    if (sql.includes('INSERT INTO horarios')) return { rows: [{ id_horario: 7, id_local: values[0] }] }
    if (sql.includes('INSERT INTO imagenes_locales')) return { rows: [{ id_imagen: 9, id_local: values[0] }] }
    throw new Error(`Consulta inesperada: ${sql}`)
  }
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api`
  const auth = rol => ({ Authorization: `Bearer ${jwt.sign({ id: 2, rol }, process.env.JWT_SECRET)}`, 'Content-Type': 'application/json' })
  const post = (path, rol, body) => fetch(`${base}/${path}`, {
    method: 'POST', headers: auth(rol), body: JSON.stringify(body),
  })
  try {
    const hour = id_local => ({ id_local, dia_semana: 'Lunes', hora_apertura: '08:00', hora_cierre: '17:00' })
    const image = id_local => ({ id_local, url_imagen: 'https://example.com/foto.jpg' })
    assert.equal((await post('horarios', 'Propietario', hour(5))).status, 403)
    assert.equal((await post('imagenes_lugares', 'Propietario', image(5))).status, 403)
    assert.equal((await post('horarios', 'Propietario', hour(6))).status, 201)
    assert.equal((await post('imagenes_lugares', 'Propietario', image(6))).status, 201)
    assert.equal((await post('horarios', 'Administrador', hour(5))).status, 201)
    assert.equal((await post('imagenes_lugares', 'Administrador', image(5))).status, 201)
    assert.equal((await fetch(`${base}/complejos_turisticos/5`, {
      method: 'PATCH', headers: auth('Propietario'), body: JSON.stringify({ capacidad_locales: 8 }),
    })).status, 403)
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = originalQuery
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  }
})
