import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'
import { authorizeUpload } from '../src/storage/uploads.service.js'

test('la galería y el calendario de un lugar turístico admiten administradores sin dueño comercial', async () => {
  const originalQuery = pool.query
  const originalSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'managed-place-resources-test'
  pool.query = async (sql, values = []) => {
    if (sql.startsWith('SELECT l.id_local FROM public.locales l'))
      return { rows: values[0] === 5 && values[1] === true ? [{ id_local: 5 }] : [] }
    if (sql.includes('FROM public.imagenes_locales i'))
      return { rows: [{ id_imagen: 3, id_local: 5, url_imagen: 'https://example.com/lugar.jpg' }] }
    if (sql.includes('AS fecha_minima'))
      return { rows: [{ fecha_minima: '2026-11-18', fecha_maxima: '2027-01-17' }] }
    if (sql.includes('FROM public.dias_cerrados_locales')) return { rows: [] }
    throw new Error(`Consulta inesperada: ${sql}`)
  }
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/gestion-lugares/5`
  const auth = rol => ({ Authorization: `Bearer ${jwt.sign({ id: 300, rol }, process.env.JWT_SECRET)}` })
  try {
    assert.equal((await fetch(`${base}/imagenes`, { headers: auth('Propietario') })).status, 403)
    const gallery = await fetch(`${base}/imagenes`, { headers: auth('Administrador') })
    assert.equal(gallery.status, 200)
    assert.equal((await gallery.json()).data[0].id_imagen, 3)
    const calendar = await fetch(`${base}/dias-cerrados`, { headers: auth('Administrador') })
    assert.equal(calendar.status, 200)
    assert.deepEqual((await calendar.json()).data.dias_cerrados, [])
    const deps = {
      config: { staging: 'staging', images: 'images', documents: 'documents', imageMax: 2097152,
        documentMax: 10485760, receiptSecret: 'test-secret-which-is-long-enough-12345', testRole: '' },
      client: { storage: { from: () => ({ createSignedUploadUrl: async () => ({ data: { token: 'signed' }, error: null }) }) } },
    }
    const input = { kind: 'image', size: 100, mime: 'image/webp', context: { type: 'local-image', localId: 5 } }
    const authorization = await authorizeUpload({ id: 300, rol: 'Administrador' }, input, deps)
    assert.match(authorization.path, /^pending\/locales\/5\/300\/.*\.webp$/)
    await assert.rejects(authorizeUpload({ id: 300, rol: 'Propietario' }, input, deps), { status: 403 })
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = originalQuery
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  }
})
