import { AppError } from "../errors/app-error.js"
import { storageConfig } from "./config.js"
import { getStorageClient } from "./client.js"

export async function verifyStorageBuckets(
  config = storageConfig(),
  client = getStorageClient(config),
) {
  const expected = [
    {
      name: config.images,
      isPublic: true,
      mime: "image/webp",
      limit: config.imageMax,
    },
    {
      name: config.documents,
      isPublic: false,
      mime: "application/pdf",
      limit: config.documentMax,
    },
    ...(config.staging
      ? [
          {
            name: config.staging,
            isPublic: false,
            mime: "image/webp",
            limit: config.imageMax,
          },
        ]
      : []),
  ]
  for (const bucket of expected) {
    const { data, error } = await client.storage.getBucket(bucket.name)
    if (
      error ||
      !data ||
      data.public !== bucket.isPublic ||
      !Array.isArray(data.allowed_mime_types) ||
      data.allowed_mime_types.length !== 1 ||
      data.allowed_mime_types[0] !== bucket.mime ||
      !Number.isSafeInteger(data.file_size_limit) ||
      data.file_size_limit !== bucket.limit
    ) {
      throw new AppError(
        `El bucket ${bucket.name} no cumple la configuración requerida`,
        503,
      )
    }
  }
}
