import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { pool } from '../src/db/db.js'
import { savePlaceSchema } from '../src/dtos/gestion_lugares.dto.js'
import * as placesRepository from '../src/repositories/gestion_lugares.repository.js'

const place = {
  id_lugar: 5, nombre: 'Reserva Azul', tipo: 'complejo', id_departamento: 1,
  municipio: 'León', descripcion: null, direccion_exacta: null, maps_link: null,
  telefono_contacto: null, correo_contacto: null, sitio_web: null,
  capacidad_locales: 10, cobro_entrada: false, costo_entrada: null,
  id_administrador: null, categorias: [2], horarios: [], imagenes: [],
}
const payload = {
  tipo: 'complejo', nombre: 'Reserva Azul', descripcion: null,
  id_departamento: 1, municipio: 'León', direccion_exacta: null,
  maps_link: null, telefono_contacto: null, correo_contacto: null, sitio_web: null,
  capacidad_locales: 12, cobro_entrada: true, costo_entrada: 25,
  id_administrador: null, categorias: [2], horarios: [],
}

test('el formulario admite lugares sin subtipo y exige los campos del subtipo correcto', () => {
  const { capacidad_locales, cobro_entrada, costo_entrada, id_administrador, ...base } = payload
  assert.equal(savePlaceSchema.validate({ ...base, tipo: 'otro' }).error, undefined)
  assert.equal(savePlaceSchema.validate({
    ...base, tipo: 'atractivo', id_administrador: null,
    tipo_acceso: 'Libre', entidad_encargada: 'Municipalidad', normativa_visitantes: null,
  }).error, undefined)
  assert.ok(savePlaceSchema.validate({ ...base, tipo: 'otro', capacidad_locales }).error)
  assert.ok(savePlaceSchema.validate({ ...base, tipo: 'complejo', cobro_entrada, costo_entrada, id_administrador }).error)
})

test('el guardado de un atractivo actualiza sus campos específicos sin tocar complejos', async () => {
  const base = { ...payload }
  delete base.capacidad_locales
  delete base.cobro_entrada
  delete base.costo_entrada
  const statements = []
  const client = { query: async (sql) => {
    statements.push(sql)
    return sql.startsWith('SELECT l.id_local AS id_lugar')
      ? { rows: [{ ...place, tipo: 'atractivo' }] }
      : { rows: [], rowCount: 1 }
  } }
  await placesRepository.save(5, {
    ...base, tipo: 'atractivo', tipo_acceso: 'Libre', entidad_encargada: 'Municipalidad',
    normativa_visitantes: null,
  }, client)
  assert.ok(statements.some(sql => sql.startsWith('UPDATE public.atractivos_independientes')))
  assert.ok(!statements.some(sql => sql.startsWith('UPDATE public.complejos_turisticos')))
})

test('solo administradores gestionan lugares y el guardado abarca las tablas compartidas', async () => {
  const originalQuery = pool.query
  const originalConnect = pool.connect
  const originalSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'gestion-lugares-test'
  const calls = []
  pool.query = async (sql, values = []) => {
    calls.push({ sql, values })
    if (['BEGIN', 'COMMIT', 'ROLLBACK'].includes(sql)) return { rows: [] }
    if (sql.includes('FOR UPDATE OF t, l')) return { rows: [{ id_lugar: 5 }] }
    if (sql.includes('FROM public.lugares_turisticos t') && sql.includes('JOIN public.departamentos d'))
      return { rows: [place] }
    if (sql.includes('FROM departamentos WHERE id_departamento') || sql.includes('FROM public.departamentos WHERE id_departamento'))
      return { rows: [{ id_departamento: 1 }] }
    if (sql.includes('FROM categorias WHERE id_categoria') || sql.includes('FROM public.categorias WHERE id_categoria'))
      return { rows: [{ id_categoria: 2 }] }
    if (sql.startsWith('UPDATE public.locales') || sql.startsWith('UPDATE public.complejos_turisticos') ||
        sql.startsWith('DELETE FROM public.horarios') || sql.startsWith('DELETE FROM public.locales_categorias') ||
        sql.startsWith('INSERT INTO public.locales_categorias')) return { rowCount: 1, rows: [] }
    throw new Error(`Consulta inesperada: ${sql}`)
  }
  pool.connect = async () => ({ query: (...args) => pool.query(...args), release: () => {} })
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/gestion-lugares`
  const auth = rol => ({ Authorization: `Bearer ${jwt.sign({ id: 8, rol }, process.env.JWT_SECRET)}` })
  try {
    assert.equal((await fetch(base)).status, 401)
    assert.equal((await fetch(base, { headers: auth('Propietario') })).status, 403)
    assert.equal((await fetch(`${base}/5`, { headers: auth('Administrador') })).status, 200)
    const saved = await fetch(`${base}/5`, {
      method: 'PUT', headers: { ...auth('Administrador'), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    assert.equal(saved.status, 200)
    assert.equal((await saved.json()).data.id_lugar, 5)
    assert.equal(calls.filter(call => call.sql === 'COMMIT').length, 1)
    assert.ok(calls.some(call => call.sql.startsWith('UPDATE public.complejos_turisticos') && call.values[1] === 12))
    assert.ok(calls.some(call => call.sql.startsWith('DELETE FROM public.locales_categorias')))
    assert.equal((await fetch(`${base}/5`, {
      method: 'PUT', headers: { ...auth('Propietario'), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })).status, 403)
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = originalQuery
    pool.connect = originalConnect
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  }
})

test('un horario ajeno revierte la edición del lugar', async () => {
  const originalQuery = pool.query
  const originalConnect = pool.connect
  const originalSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'gestion-lugares-rollback-test'
  const calls = []
  pool.query = async (sql) => {
    calls.push(sql)
    if (['BEGIN', 'COMMIT', 'ROLLBACK'].includes(sql)) return { rows: [] }
    if (sql.includes('FOR UPDATE OF t, l')) return { rows: [{ id_lugar: 5 }] }
    if (sql.includes('FROM public.lugares_turisticos t') && sql.includes('JOIN public.departamentos d')) return { rows: [place] }
    if (sql.includes('FROM public.departamentos WHERE id_departamento')) return { rows: [{ id_departamento: 1 }] }
    if (sql.includes('FROM categorias WHERE id_categoria')) return { rows: [{ id_categoria: 2 }] }
    if (sql.startsWith('UPDATE public.horarios')) return { rowCount: 0, rows: [] }
    if (sql.startsWith('UPDATE public.locales') || sql.startsWith('UPDATE public.complejos_turisticos')) return { rowCount: 1, rows: [] }
    throw new Error(`Consulta inesperada: ${sql}`)
  }
  pool.connect = async () => ({ query: (...args) => pool.query(...args), release: () => {} })
  const server = app.listen(0)
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/gestion-lugares/5`, {
      method: 'PUT', headers: {
        Authorization: `Bearer ${jwt.sign({ id: 8, rol: 'Administrador' }, process.env.JWT_SECRET)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, horarios: [{ id_horario: 99, dia_semana: 'Lunes', hora_apertura: '08:00', hora_cierre: '17:00', es_feriado: false }] }),
    })
    assert.equal(response.status, 409)
    assert.ok(calls.includes('ROLLBACK'))
    assert.ok(!calls.includes('COMMIT'))
  } finally {
    await new Promise(resolve => server.close(resolve))
    pool.query = originalQuery
    pool.connect = originalConnect
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  }
})
