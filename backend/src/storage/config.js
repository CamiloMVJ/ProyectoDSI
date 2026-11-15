import { AppError } from "../errors/app-error.js"

const bucketName = (value) => /^[a-z0-9][a-z0-9_-]{2,62}$/i.test(value || "")

export function storageConfig(env = process.env) {
  if (env.SUPABASE_STORAGE_ENABLED !== "true") {
    throw new AppError("El almacenamiento de archivos no está habilitado", 503)
  }
  const url = env.SUPABASE_URL
  const secretKey = env.SUPABASE_SECRET_KEY
  const receiptSecret = env.SUPABASE_RECEIPT_SECRET
  const images = env.SUPABASE_BUCKET_IMAGES || "imagenes-publicas"
  const documents = env.SUPABASE_BUCKET_DOCUMENTS || "documentos-privados"
  const staging = env.SUPABASE_BUCKET_STAGING || ""
  const imageMax = Number(env.SUPABASE_IMAGE_MAX_BYTES || 2097152)
  const documentMax = Number(env.SUPABASE_DOCUMENT_MAX_BYTES || 10485760)
  let projectUrl
  try {
    projectUrl = new URL(url)
  } catch {
    /* handled below */
  }
  if (
    projectUrl?.protocol !== "https:" ||
    !projectUrl.hostname.endsWith(".supabase.co") ||
    !secretKey ||
    !receiptSecret ||
    receiptSecret.length < 32 ||
    !bucketName(images) ||
    !bucketName(documents) ||
    (staging && !bucketName(staging)) ||
    new Set([images, documents, staging].filter(Boolean)).size !==
      [images, documents, staging].filter(Boolean).length ||
    !Number.isSafeInteger(imageMax) ||
    imageMax <= 0 ||
    imageMax > 2097152 ||
    !Number.isSafeInteger(documentMax) ||
    documentMax <= 0 ||
    documentMax > 10485760
  ) {
    throw new AppError("Configuración de Storage incompleta o inválida", 503)
  }
  return {
    url: projectUrl.origin,
    secretKey,
    receiptSecret,
    images,
    documents,
    staging,
    imageMax,
    documentMax,
    testRole: env.SUPABASE_STORAGE_TEST_ROLE || "",
  }
}

export function checkStorageStartup(env = process.env) {
  if (env.SUPABASE_STORAGE_ENABLED === "true") storageConfig(env)
}
