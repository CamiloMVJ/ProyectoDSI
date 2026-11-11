import test from 'node:test'
import assert from 'node:assert/strict'
import { buscarLugaresSchema } from '../src/dtos/lugar.dto.js'
import * as lugares from '../src/repositories/lugares_turisticos.repository.js'
import * as comerciales from '../src/repositories/locales_comerciales.repository.js'

test('la categoría consulta la tabla de unión sin aplicar presupuesto', async () => {
  const queries = []
  const client = { async query(sql, values) { queries.push({ sql, values }); return { rows: [] } } }
  const { value, error } = buscarLugaresSchema.validate({ id_categoria: '4' })
  assert.equal(error, undefined)
  await lugares.search(value, client)
  await comerciales.findAll(null, 4, client)

  assert.match(queries[0].sql, /lc\.id_local = l\.id_lugar AND lc\.id_categoria = \$5/)
  assert.doesNotMatch(queries[0].sql, /budget\.precio_minimo <=/)
  assert.deepEqual(queries[0].values, ['', null, '', 'todos', 4])
  assert.match(queries[1].sql, /lc\.id_local = c\.id_local AND lc\.id_categoria = \$1/)
  assert.doesNotMatch(queries[1].sql, /c\.precio_minimo <=/)
  assert.deepEqual(queries[1].values, [4])
})

test('el presupuesto se aplica solo cuando se solicita', async () => {
  const queries = []
  const client = { async query(sql, values) { queries.push({ sql, values }); return { rows: [] } } }
  const { value } = buscarLugaresSchema.validate({ id_categoria: '4', max_budget: '250' })
  await lugares.search(value, client)
  await comerciales.findAll(250, 4, client)

  assert.match(queries[0].sql, /budget\.precio_minimo <= \$5/)
  assert.match(queries[0].sql, /lc\.id_categoria = \$6/)
  assert.deepEqual(queries[0].values.slice(-2), [250, 4])
  assert.match(queries[1].sql, /c\.precio_minimo <= \$1/)
  assert.match(queries[1].sql, /lc\.id_categoria = \$2/)
  assert.deepEqual(queries[1].values, [250, 4])
})
