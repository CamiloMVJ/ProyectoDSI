import { AppError } from "../errors/app-error.js"

const buckets = new Map()
const WINDOW = 60 * 60 * 1000
const MAX = 20
const ADMIN_MAX = 100

export function limitAuthorizations(userId, role, now = Date.now()) {
  const max = role === "Administrador" ? ADMIN_MAX : MAX
  const recent = (buckets.get(userId) || []).filter(
    (time) => now - time < WINDOW,
  )
  if (recent.length >= max)
    throw new AppError(
      "Demasiadas solicitudes de subida. Inténtalo más tarde",
      429,
    )
  recent.push(now)
  buckets.set(userId, recent)
}
