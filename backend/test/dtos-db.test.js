import test from 'node:test'
import assert from 'node:assert/strict'
import { campaniaSchema } from '../src/dtos/campania.dto.js'
import { itemMenuSchema } from '../src/dtos/Items_Menu.dto.js'
import { pagoSchema } from '../src/dtos/pago.dto.js'
import { servicioSchema } from '../src/dtos/servicio.dto.js'
import { updatePagoSchema } from '../src/dtos/update.dto.js'
import { create as createPago } from '../src/repositories/pagos_publicitarios.repository.js'

const cases = [
  [campaniaSchema, { id_local: 1, fecha_inicio: '2026-11-15', fecha_fin: '2026-11-16', monto_total: 10 }],
  [itemMenuSchema, { id_menu: 1, nombre_platillo: 'Plato', precio: 10 }],
  [pagoSchema, { id_campania: 1, monto: 10 }],
  [servicioSchema, { id_local: 1, nombre_servicio: 'Servicio', precio: 10 }],
]

test('moneda y capacidad de NUMERIC(10,2) coinciden con SQL', () => {
  for (const [schema, base] of cases) {
    assert.equal(schema.validate({ ...base, moneda: 'USD' }).error, undefined)
    assert.ok(schema.validate({ ...base, moneda: 'EUR' }).error)
    const amount = ['monto_total', 'precio', 'monto'].find(key => key in base)
    assert.ok(schema.validate({ ...base, [amount]: 100000000 }).error)
  }
})

test('la categoría de ítem es nullable y los IDs caben en INTEGER', () => {
  const base = { id_menu: 1, nombre_platillo: 'Plato', precio: 10 }
  assert.equal(itemMenuSchema.validate(base).error, undefined)
  assert.equal(itemMenuSchema.validate({ ...base, id_categoria_menu: null }).error, undefined)
  assert.ok(itemMenuSchema.validate({ ...base, id_menu: 2147483648 }).error)
})

test('pagos no admite id_administrador y su INSERT usa solo columnas existentes', async () => {
  assert.ok(pagoSchema.validate({ id_campania: 1, monto: 10, id_administrador: 2 }).error)
  assert.ok(updatePagoSchema.validate({ id_administrador: 2 }).error)
  let sql
  const db = { query: async (query, values) => {
    sql = query
    assert.equal(values.length, 8)
    return { rows: [{ id_pago: 1 }] }
  } }
  await createPago({ id_campania: 1, monto: 10 }, db)
  assert.doesNotMatch(sql, /id_administrador/)
})
