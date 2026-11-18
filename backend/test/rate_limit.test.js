import test from "node:test"
import assert from "node:assert/strict"
import { limitAuthorizations } from "../src/storage/rate-limit.js"

test("un administrador puede autorizar 100 subidas por hora, pero no la 101", () => {
  const now = 1_000_000
  for (let index = 0; index < 100; index++) {
    assert.doesNotThrow(() => limitAuthorizations(9001, "Administrador", now))
  }
  assert.throws(() => limitAuthorizations(9001, "Administrador", now), {
    status: 429,
  })
  assert.doesNotThrow(() =>
    limitAuthorizations(9001, "Administrador", now + 60 * 60 * 1000),
  )
})

test("los usuarios que no son administradores conservan el límite de 20 subidas por hora", () => {
  const now = 2_000_000
  for (let index = 0; index < 20; index++) {
    assert.doesNotThrow(() => limitAuthorizations(9002, "Propietario", now))
  }
  assert.throws(() => limitAuthorizations(9002, "Propietario", now), {
    status: 429,
  })
})

test("el límite normal se aplica si una cuenta deja de ser administradora", () => {
  const now = 3_000_000
  for (let index = 0; index < 21; index++) {
    limitAuthorizations(9003, "Administrador", now)
  }
  assert.throws(() => limitAuthorizations(9003, "Propietario", now), {
    status: 429,
  })
})
