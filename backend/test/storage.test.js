import test from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
import { storageConfig } from '../src/storage/config.js'
import { authorizeStorage } from '../src/storage/policy.js'
import { signReceipt, verifyReceipt } from '../src/storage/receipt.js'
import { authorizeUpload, confirmUpload, signedDownload, deleteUpload } from '../src/storage/uploads.service.js'
import { cleanupPending } from '../src/storage/cleanup.js'
import { verifyStorageBuckets } from '../src/storage/verify-buckets.js'
import { readStorageFile } from '../src/storage/validate-content.js'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'

const config = {
  url: 'https://example.supabase.co', secretKey: 'private', receiptSecret: 'a'.repeat(40),
  images: 'imagenes-publicas', documents: 'documentos-privados', staging: 'imagenes-staging',
  imageMax: 2097152, documentMax: 10485760, testRole: 'Propietario',
}
const owner = { id: 7, rol: 'Propietario' }
const context = { type: 'sandbox' }

test('la configuración y política están cerradas por defecto', () => {
  assert.throws(() => storageConfig({}), /no está habilitado/)
  assert.throws(() => authorizeStorage(owner, 'authorize', null, { ...config, testRole: '' }), /No tenés permiso/)
  assert.throws(() => authorizeStorage({ id: 8, rol: 'Propietario' }, 'download',
    { userId: 7, scope: 'sandbox' }, config), /No tenés permiso/)
})

test('el comprobante detecta cambios y caducidad', () => {
  const token = signReceipt({ stage: 'pending', exp: Date.now() + 1000 }, config.receiptSecret)
  assert.equal(verifyReceipt(token, config.receiptSecret).stage, 'pending')
  assert.throws(() => verifyReceipt(`${token}x`, config.receiptSecret), /inválido/)
  assert.throws(() => verifyReceipt(token, config.receiptSecret, Date.now() + 2000), /vencido/)
})

test('la ruta rechaza JWT ausente o inválido antes de acceder a Storage', async () => {
  const previous = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'uploads-test-secret'
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/uploads/authorize`
  try {
    assert.equal((await fetch(base, { method: 'POST' })).status, 401)
    const bad = jwt.sign({ id: 7, rol: 'Propietario' }, 'another-secret')
    assert.equal((await fetch(base, { method: 'POST', headers: { Authorization: `Bearer ${bad}` } })).status, 403)
    const good = jwt.sign(owner, process.env.JWT_SECRET)
    const arbitraryBucket = await fetch(base, { method: 'POST', headers: {
      Authorization: `Bearer ${good}`, 'Content-Type': 'application/json',
    }, body: JSON.stringify({ kind: 'image', size: 100, mime: 'image/webp', context, bucket: 'cualquiera' }) })
    assert.equal(arbitraryBucket.status, 400)
  } finally {
    await new Promise(resolve => server.close(resolve))
    if (previous === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = previous
  }
})

test('autoriza solo bucket interno, tamaño y tipo compatibles', async () => {
  const paths = []
  const client = { storage: { from: bucket => {
    assert.equal(bucket, config.staging)
    return { createSignedUploadUrl: async path => { paths.push(path); return { data: { token: 'signed' } } } }
  } } }
  const result = await authorizeUpload(owner, { kind: 'image', mime: 'image/webp', size: 100, bucket: 'otro', context }, { config, client })
  assert.equal(result.bucket, config.staging)
  assert.match(paths[0], /^pending\/sandbox\/7\//)
  await assert.rejects(authorizeUpload(owner, { kind: 'image', mime: 'image/png', size: 100, context }, { config, client }), /Formato/)
  await assert.rejects(authorizeUpload(owner, { kind: 'image', mime: 'image/webp', size: 2097153, context }, { config, client }), /Formato/)
  await assert.rejects(authorizeUpload({ id: 8, rol: 'Usuario' }, { kind: 'image', mime: 'image/webp', size: 100, context }, { config, client }), /permiso/)
})

test('confirma WebP válido antes de publicarlo y rechaza bytes falsos', async () => {
  const image = await sharp({ create: { width: 10, height: 10, channels: 4, background: '#ff000080' } }).webp().toBuffer()
  let published = 0
  const source = {
    createSignedUploadUrl: async () => ({ data: { token: 'signed' } }),
    info: async () => ({ data: { size: image.length, contentType: 'image/webp' } }),
    createSignedUrl: async () => ({ data: { signedUrl: 'https://example.supabase.co/storage/v1/object/sign/test' } }),
    remove: async () => ({ error: null }),
  }
  const destination = {
    upload: async () => { published++; return { error: null } },
    getPublicUrl: () => ({ data: { publicUrl: 'https://example.supabase.co/storage/v1/object/public/x' } }),
  }
  const client = { storage: { from: bucket => bucket === config.staging ? source : destination } }
  const { receipt } = await authorizeUpload(owner, { kind: 'image', mime: 'image/webp', size: image.length, context }, { config, client })
  const deps = { config, client, fetcher: async () => new Response(image) }
  const result = await confirmUpload(owner, receipt, deps)
  assert.equal(published, 1)
  assert.equal(result.kind, 'image')
  await assert.rejects(confirmUpload({ id: 8, rol: 'Propietario' }, receipt, deps), /permiso/)
  await assert.rejects(confirmUpload(owner, receipt, { ...deps, fetcher: async () => new Response(Buffer.alloc(image.length)) }), /WebP/)
  assert.equal(published, 1)
  const ref = verifyReceipt(receipt, config.receiptSecret)
  const changedPath = signReceipt({ ...ref, path: 'pending/sandbox/8/evil.webp' }, config.receiptSecret)
  await assert.rejects(confirmUpload(owner, changedPath, deps), /Referencia/)
})

test('la lectura controlada corta archivos que exceden el límite', async () => {
  const client = { storage: { from: () => ({ createSignedUrl: async () =>
    ({ data: { signedUrl: 'https://example.supabase.co/storage/v1/object/sign/test' } }) }) } }
  await assert.rejects(readStorageFile(client, 'private', 'pending/a', 3, config.url,
    async () => new Response(Buffer.from('too much'))), /supera el límite/)
})

test('documento privado: confirmar, descargar y eliminar solo como propietario', async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage([100, 100])
  const bytes = Buffer.from(await pdf.save())
  let moved = 0
  let removed = 0
  const store = {
    createSignedUploadUrl: async () => ({ data: { token: 'signed' } }),
    info: async () => ({ data: { size: bytes.length, contentType: 'application/pdf' } }),
    createSignedUrl: async () => ({ data: { signedUrl: 'https://example.supabase.co/storage/v1/object/sign/test' } }),
    move: async () => { moved++; return { error: null } },
    remove: async () => { removed++; return { error: null } },
  }
  const client = { storage: { from: () => store } }
  const { receipt } = await authorizeUpload(owner, { kind: 'document', mime: 'application/pdf', size: bytes.length, context }, { config, client })
  const { fileId } = await confirmUpload(owner, receipt, { config, client, fetcher: async () => new Response(bytes) })
  assert.equal(moved, 1)
  assert.equal((await signedDownload(owner, fileId, { config, client })).expiresIn, 60)
  await assert.rejects(signedDownload({ id: 8, rol: 'Propietario' }, fileId, { config, client }), /permiso/)
  await assert.rejects(deleteUpload({ id: 8, rol: 'Propietario' }, fileId, { config, client }), /permiso/)
  assert.equal((await deleteUpload(owner, fileId, { config, client })).deleted, true)
  assert.equal(removed, 1)
})

test('documento de solicitud: exige propietario y registra la ruta privada', async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage([100, 100])
  const bytes = Buffer.from(await pdf.save())
  const saved = []
  let owned = true
  const business = {
    findOwnedPendingRequest: async () => owned ? { id_solicitud: 12 } : null,
    findOwnedRequest: async () => ({ id_solicitud: 12 }),
    saveRequestDocument: async (...args) => { saved.push(args); return { id_documento: 3 } },
  }
  const store = {
    createSignedUploadUrl: async () => ({ data: { token: 'signed' } }),
    info: async () => ({ data: { size: bytes.length, contentType: 'application/pdf' } }),
    createSignedUrl: async () => ({ data: { signedUrl: 'https://example.supabase.co/storage/v1/object/sign/test' } }),
    move: async () => ({ error: null }),
  }
  const client = { storage: { from: bucket => {
    assert.equal(bucket, config.documents)
    return store
  } } }
  const deps = { config: { ...config, testRole: '' }, client, business, fetcher: async () => new Response(bytes) }
  const input = { kind: 'document', mime: 'application/pdf', size: bytes.length,
    context: { type: 'business-request', requestId: 12, documentType: 'RUC', fileName: 'ruc.pdf' } }
  const { receipt, path } = await authorizeUpload({ id: 7, rol: 'Usuario' }, input, deps)
  assert.match(path, /^pending\/solicitudes\/12\/7\//)
  owned = false
  await assert.rejects(confirmUpload({ id: 7, rol: 'Usuario' }, receipt, deps), /no te pertenece/)
  owned = true
  const { fileId } = await confirmUpload({ id: 7, rol: 'Usuario' }, receipt, deps)
  assert.deepEqual(saved[0].slice(0, 4), [12, 7, 'ruc.pdf', 'RUC'])
  assert.match(saved[0][4], /^final\/solicitudes\/12\/7\//)
  assert.equal((await signedDownload({ id: 7, rol: 'Usuario' }, fileId, deps)).expiresIn, 60)
  await assert.rejects(deleteUpload({ id: 7, rol: 'Usuario' }, fileId, deps), /permiso/)
  await assert.rejects(authorizeUpload({ id: 8, rol: 'Administrador' }, input, deps), /permiso/)
})

test('limpieza protege archivos recientes y definitivos; el modo simulación no elimina', async () => {
  const now = Date.parse('2026-11-15T18:00:00Z')
  const epoch = '2026-11-01T00:00:00Z'
  const oldName = '11111111-1111-4111-8111-111111111111.pdf'
  const calls = []
  const store = {
    list: async prefix => ({ data: prefix === 'pending/sandbox' ? [{ name: '7' }]
      : prefix === 'pending/sandbox/7' ? [
        { name: oldName, created_at: '2026-11-15T10:00:00Z' },
        { name: '22222222-2222-4222-8222-222222222222.pdf', created_at: '2026-11-15T17:00:00Z' },
      ] : prefix === 'pending/solicitudes' ? [{ name: '12' }]
        : prefix === 'pending/solicitudes/12' ? [{ name: '7' }]
          : prefix === 'pending/solicitudes/12/7' ? [
            { name: oldName, created_at: '2026-11-15T10:00:00Z' },
          ] : [] }),
    remove: async paths => { calls.push(paths); return { error: null } },
  }
  const client = { storage: { from: () => store } }
  const localConfig = { ...config, staging: '' }
  assert.deepEqual(await cleanupPending({ config: localConfig, client, now, epoch }),
    { dryRun: true, candidates: 2, deleted: 0 })
  assert.equal(calls.length, 0)
  assert.deepEqual(await cleanupPending({ config: localConfig, client, now, epoch, dryRun: false }),
    { dryRun: false, candidates: 2, deleted: 2 })
  assert.deepEqual(calls, [[`pending/sandbox/7/${oldName}`], [`pending/solicitudes/12/7/${oldName}`]])
})

test('comprueba visibilidad, MIME y límites de buckets sin modificarlos', async () => {
  const buckets = {
    [config.images]: { public: true, allowed_mime_types: ['image/webp'], file_size_limit: config.imageMax },
    [config.documents]: { public: false, allowed_mime_types: ['application/pdf'], file_size_limit: config.documentMax },
    [config.staging]: { public: false, allowed_mime_types: ['image/webp'], file_size_limit: config.imageMax },
  }
  const client = { storage: { getBucket: async name => ({ data: buckets[name] }) } }
  await verifyStorageBuckets(config, client)
  buckets[config.staging].public = true
  await assert.rejects(verifyStorageBuckets(config, client), /no cumple/)
})
