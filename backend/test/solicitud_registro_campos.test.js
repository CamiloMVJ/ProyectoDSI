import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'
import { authorizeUploadSchema } from '../src/dtos/upload.dto.js'

test('guarda los campos nuevos y categorías en la misma transacción', async () => {
  const previousQuery = pool.query
  const previousConnect = pool.connect
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'solicitudes-campos-test'
  const calls = []
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values })
    if (sql.includes('FROM public.departamentos')) return { rows: [{ id_departamento: 10 }] }
    if (sql.includes('FROM complejos_turisticos WHERE id_lugar')) return { rows: [{ id_lugar: 5 }] }
    if (sql.includes('AS existe')) return { rows: [{ existe: false }] }
    if (sql.includes('INSERT INTO public.solicitudes_registros')) return { rows: [{ id_solicitud: 9, estado: 'Pendiente' }] }
    return { rows: [] }
  }
  pool.connect = async () => ({ query: (...args) => pool.query(...args), release: () => {} })
  const server = app.listen(0)
  const token = jwt.sign({ id: 7, rol: 'Usuario' }, process.env.JWT_SECRET)
  const body = {
    nombre_negocio: 'Hotel Sol', razon_social: 'Hotel Sol S.A.', codigo_ruc: '12345',
    numero_cedula_solicitante: '001-010101-0001A', tipo_persona: 'Persona Jurídica',
    descripcion: 'Hospedaje', es_independiente: false, id_complejo_padre: 5,
    id_departamento: 10, municipio: 'Managua', direccion_exacta: 'Centro',
    maps_link: 'https://maps.google.com/', telefono_contacto: '88888888',
    correo_contacto: 'local@example.com', sitio_web: 'https://example.com',
    categorias: [2, 4],
  }

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/solicitudes_registros`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    assert.equal(response.status, 201)
    const insertion = calls.find(call => call.sql.includes('INSERT INTO public.solicitudes_registros'))
    for (const field of ['razon_social', 'numero_cedula_solicitante', 'tipo_persona', 'es_independiente', 'id_complejo_padre', 'maps_link', 'telefono_contacto', 'correo_contacto', 'sitio_web'])
      assert.match(insertion.sql, new RegExp(field))
    assert.ok(insertion.values.includes('Hotel Sol S.A.'))
    assert.ok(insertion.values.includes(false))
    assert.ok(insertion.values.includes(5))
    const categories = calls.find(call => call.sql.includes('INSERT INTO public.solicitudes_categorias'))
    assert.deepEqual(categories.values, [9, [2, 4]])
    assert.ok(calls.findIndex(call => call.sql === 'COMMIT') > calls.findIndex(call => call.sql.includes('INSERT INTO public.solicitudes_categorias')))
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = previousQuery
    pool.connect = previousConnect
    if (previousSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = previousSecret
  }
})

test('acepta los tres tipos nuevos de documento PDF', () => {
  for (const documentType of ['Cédula de Identidad', 'Constancia RUC', 'Permiso o Constancia']) {
    const { error } = authorizeUploadSchema.validate({
      kind: 'document', size: 100, mime: 'application/pdf',
      context: { type: 'business-request', requestId: 9, documentType, fileName: 'archivo.pdf' },
    })
    assert.equal(error, undefined)
  }
})
