import { AppError } from "../errors/app-error.js"

const buckets = new Map()
const WINDOW = 60 * 60 * 1000
const MAX = 20

export function limitAuthorizations(userId, now = Date.now()) {
  const recent = (buckets.get(userId) || []).filter(
    (time) => now - time < WINDOW,
  )
  if (recent.length >= MAX)
    throw new AppError(
      "Demasiadas solicitudes de subida. Inténtalo más tarde",
      429,
    )
  recent.push(now)
  buckets.set(userId, recent)
}
