import { AppError } from "../errors/app-error.js"
import { storageConfig } from "./config.js"
import { getStorageClient } from "./client.js"

const LIMIT = 100
const MIN_AGE_MS = 4 * 60 * 60 * 1000
const FILE_NAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|pdf)$/i

async function listAll(store, prefix) {
  const entries = []
  for (let offset = 0; ; offset += LIMIT) {
    const { data, error } = await store.list(prefix, {
      limit: LIMIT,
      offset,
      sortBy: { column: "name", order: "asc" },
    })
    if (error)
      throw new AppError("No se pudo listar los archivos pendientes", 502)
    entries.push(...data)
    if (data.length < LIMIT) return entries
  }
}

export async function cleanupPending({
  config = storageConfig(),
  client = getStorageClient(config),
  now = Date.now(),
  dryRun = true,
  epoch = process.env.SUPABASE_STORAGE_EPOCH,
} = {}) {
  const since = Date.parse(epoch)
  if (!Number.isFinite(since) || since > now || now - since < MIN_AGE_MS) {
    throw new AppError(
      "Configura SUPABASE_STORAGE_EPOCH con una fecha de inicio válida",
      503,
    )
  }
  const result = { dryRun, candidates: 0, deleted: 0 }
  for (const bucket of [config.documents, config.staging].filter(Boolean)) {
    const store = client.storage.from(bucket)
    const folders = await listAll(store, "pending/sandbox")
    for (const folder of folders) {
      if (!/^\d+$/.test(folder.name)) continue
      const base = `pending/sandbox/${folder.name}`
      const files = await listAll(store, base)
      for (const file of files) {
        if (!FILE_NAME.test(file.name)) continue
        if (bucket === config.documents && !file.name.endsWith(".pdf")) continue
        if (bucket === config.staging && !file.name.endsWith(".webp")) continue
        const created = Date.parse(file.created_at)
        if (
          !Number.isFinite(created) ||
          created < since ||
          now - created < MIN_AGE_MS
        )
          continue
        result.candidates++
        if (!dryRun) {
          const { error } = await store.remove([`${base}/${file.name}`])
          if (error)
            throw new AppError("No se pudo limpiar un archivo pendiente", 502)
          result.deleted++
        }
      }
    }
  }
  return result
}
