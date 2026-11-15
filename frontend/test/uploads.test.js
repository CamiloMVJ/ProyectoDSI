import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareWebp } from '../src/services/prepareWebp.js'
import { uploadStorageFile } from '../src/services/uploads.api.js'

function canvasHarness(outputSize = 100) {
  const dimensions = []
  const bitmap = { width: 3200, height: 1600, closed: false, close() { this.closed = true } }
  const canvasFactory = (width, height) => {
    dimensions.push([width, height])
    return { width, height, getContext: () => ({ drawImage() {} }),
      convertToBlob: async () => new Blob([new Uint8Array(outputSize)], { type: 'image/webp' }) }
  }
  return { bitmap, dimensions, canvasFactory, bitmapFactory: async () => bitmap }
}

test('convierte JPEG y PNG a WebP sin perder proporciones y libera la imagen', async () => {
  for (const type of ['image/jpeg', 'image/png']) {
    const harness = canvasHarness()
    const result = await prepareWebp(new File(['x'], `foto.${type.split('/')[1]}`, { type }), harness)
    assert.equal(result.type, 'image/webp')
    assert.equal(result.name, 'foto.webp')
    assert.deepEqual(harness.dimensions, [[1600, 800]])
    assert.equal(harness.bitmap.closed, true)
  }
})

test('no amplía imágenes pequeñas y rechaza archivos dañados o compresión insuficiente', async () => {
  const small = canvasHarness()
  small.bitmap.width = 400
  small.bitmap.height = 200
  await prepareWebp(new File(['x'], 'small.png', { type: 'image/png' }), small)
  assert.deepEqual(small.dimensions, [[400, 200]])
  await assert.rejects(prepareWebp(new File(['x'], 'bad.gif', { type: 'image/gif' })), /JPEG, PNG o WebP/)
  await assert.rejects(prepareWebp(new File(['x'], 'bad.png', { type: 'image/png' }),
    { bitmapFactory: async () => { throw new Error('decode failed') } }), /No se pudo abrir/)
  const huge = canvasHarness(2097153)
  await assert.rejects(prepareWebp(new File(['x'], 'huge.png', { type: 'image/png' }), huge), /superando 2 MB/)
  assert.equal(huge.dimensions.length, 4)
})

test('la subida informa fallos de autorización, Storage y confirmación', async () => {
  const pdf = new File(['%PDF-test'], 'doc.pdf', { type: 'application/pdf' })
  const client = { storage: { from: () => ({ uploadToSignedUrl: async () => ({ error: null }) }) } }
  const auth = { bucket: 'private', path: 'pending/x.pdf', token: 'signed', receipt: 'receipt' }
  await assert.rejects(uploadStorageFile(pdf, 'jwt', {}, { getClient: () => client, request: async () => { throw new Error('sin permiso') } }), /sin permiso/)
  const uploadFailure = { storage: { from: () => ({ uploadToSignedUrl: async () => ({ error: new Error('network') }) }) } }
  await assert.rejects(uploadStorageFile(pdf, 'jwt', {}, { getClient: () => uploadFailure, request: async () => auth }), /No se pudo subir/)
  await assert.rejects(uploadStorageFile(pdf, 'jwt', {}, { getClient: () => client,
    request: async path => path.endsWith('authorize') ? auth : Promise.reject(new Error('confirmación falló')) }), /confirmación falló/)
  const statuses = []
  const result = await uploadStorageFile(pdf, 'jwt', { onStatus: status => statuses.push(status) },
    { getClient: () => client, request: async path => path.endsWith('authorize') ? auth : { fileId: 'file-id' } })
  assert.equal(result.fileId, 'file-id')
  assert.deepEqual(statuses, ['preparing', 'authorizing', 'uploading', 'confirming', 'complete'])
})

test('rechaza un PDF con cabecera falsa antes de pedir autorización', async () => {
  const bad = new File(['no es PDF'], 'falso.pdf', { type: 'application/pdf' })
  await assert.rejects(uploadStorageFile(bad, 'jwt', {}, {
    getClient: () => { throw new Error('No debe abrirse Storage') },
  }), /no es un PDF válido/)
})
