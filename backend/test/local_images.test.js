import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'
import { authorizeUpload } from '../src/storage/uploads.service.js'

test('las imágenes del local se listan y eliminan solo para su dueño', async () => {
  const originalQuery = pool.query
  const originalConnect = pool.connect
  const originalSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'local-images-test'
  const images = [{ id_imagen: 7, id_local: 5, url_imagen: 'https://legacy.example/photo.jpg' }]
  pool.query = async (sql, values = []) => {
    if (['BEGIN', 'COMMIT', 'ROLLBACK'].includes(sql)) return { rows: [] }
    if (sql.includes('SELECT c.id_local FROM public.locales_comerciales'))
      return { rows: values[0] === 5 && (values[1] || values[2] === 2) ? [{ id_local: 5 }] : [] }
    if (sql.includes('FROM public.imagenes_locales i') && sql.includes('ORDER BY'))
      return { rows: values[0] === 5 && (values[1] || values[2] === 2) ? [...images] : [] }
    if (sql.includes('FOR UPDATE OF i'))
      return { rows: values[0] === 5 && values[1] === 7 && (values[2] || values[3] === 2) ? [images[0]] : [] }
    if (sql.includes('DELETE FROM public.imagenes_locales')) {
      images.splice(0, 1)
      return { rows: [] }
    }
    throw new Error(`Consulta inesperada: ${sql}`)
  }
  pool.connect = async () => ({ query: (...args) => pool.query(...args), release: () => {} })
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/gestion-establecimientos/5/imagenes`
  const auth = id => ({ Authorization: `Bearer ${jwt.sign({ id, rol: 'Propietario' }, process.env.JWT_SECRET)}` })
  try {
    assert.equal((await fetch(base)).status, 401)
    assert.equal((await fetch(base, { headers: auth(3) })).status, 404)
    const listed = await fetch(base, { headers: auth(2) })
    assert.equal(listed.status, 200)
    assert.equal((await listed.json()).data.length, 1)
    assert.equal((await fetch(`${base}/7`, { method: 'DELETE', headers: auth(3) })).status, 404)
    assert.equal((await fetch(`${base}/7`, { method: 'DELETE', headers: auth(2) })).status, 200)
    assert.equal(images.length, 0)
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = originalQuery
    pool.connect = originalConnect
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  }
})

test('autorizar imagen de local exige propiedad y genera ruta separada por archivo', async () => {
  const paths = []
  const deps = {
    config: { staging: 'staging', images: 'images', documents: 'documents', imageMax: 2097152, documentMax: 10485760, receiptSecret: 'test-secret-which-is-long-enough-12345', testRole: '' },
    client: { storage: { from: () => ({ createSignedUploadUrl: async path => { paths.push(path); return { data: { token: 'signed' }, error: null } } }) } },
    localImages: { findManagedLocal: async (localId, userId) => localId === 5 && userId === 2 },
  }
  const input = { kind: 'image', size: 100, mime: 'image/webp', context: { type: 'local-image', localId: 5 } }
  await assert.rejects(authorizeUpload({ id: 3, rol: 'Propietario' }, input, deps), { status: 403 })
  const first = await authorizeUpload({ id: 2, rol: 'Propietario' }, input, deps)
  const second = await authorizeUpload({ id: 2, rol: 'Propietario' }, input, deps)
  assert.match(first.path, /^pending\/locales\/5\/2\/.*\.webp$/)
  assert.notEqual(first.path, second.path)
  assert.equal(paths.length, 2)
})
