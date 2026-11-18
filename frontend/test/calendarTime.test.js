import test from 'node:test'
import assert from 'node:assert/strict'
import { formatEventTime, timeInputValue } from '../src/services/calendarUtils.js'

test('las horas de PostgreSQL vuelven al formulario y se muestran en 12 horas', () => {
  const examples = [
    ['00:00:00', '00:00', '12:00 a. m.'],
    ['09:05:00', '09:05', '9:05 a. m.'],
    ['12:00:00', '12:00', '12:00 p. m.'],
    ['15:30:00', '15:30', '3:30 p. m.'],
    ['23:59:00', '23:59', '11:59 p. m.'],
  ]
  for (const [stored, input, label] of examples) {
    assert.equal(timeInputValue(stored), input)
    assert.equal(formatEventTime(stored), label)
    assert.equal(formatEventTime(input), label)
  }
  assert.equal(timeInputValue(null), '')
  assert.equal(formatEventTime('25:00:00'), '')
})
