import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { AppError } from '../errors/app-error.js'

const derive = promisify(scrypt)
const options = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    throw new AppError('La contraseña debe tener entre 8 y 255 caracteres', 400)
  }
  const salt = randomBytes(16).toString('hex')
  const key = await derive(password, salt, 64, options)
  return `scrypt$${salt}$${key.toString('hex')}`
}

// Disponible para el futuro login: estos hashes no son bcrypt.
export async function verifyPassword(password, hash) {
  if (typeof password !== 'string' || typeof hash !== 'string') return false
  const [algorithm, salt, stored, extra] = hash.split('$')
  if (algorithm !== 'scrypt' || extra !== undefined || !/^[a-f0-9]{32}$/.test(salt ?? '') || !/^[a-f0-9]{128}$/.test(stored ?? '')) return false
  const key = await derive(password, salt, 64, options)
  return timingSafeEqual(key, Buffer.from(stored, 'hex'))
}
