import { request } from "./httpClient.js"
import { getPublicStorageClient } from "./storageClient.js"
import { prepareWebp } from "./prepareWebp.js"

export async function uploadStorageFile(
  file,
  token,
  { onStatus = () => {} } = {},
  deps = {},
) {
  if (!(file instanceof File)) throw new Error("Selecciona un archivo válido.")
  const kind = file.type === "application/pdf" ? "document" : "image"
  if (kind === "document" && (file.size === 0 || file.size > 10485760)) {
    throw new Error("El PDF debe tener contenido y no superar 10 MB.")
  }
  if (kind === 'document') {
    const header = new TextDecoder('ascii').decode(await file.slice(0, 5).arrayBuffer())
    if (header !== '%PDF-') throw new Error('El archivo seleccionado no es un PDF válido.')
  }
  onStatus("preparing")
  const prepared =
    kind === "image" ? await (deps.prepareWebp || prepareWebp)(file) : file
  const client = (deps.getClient || getPublicStorageClient)()
  const send = deps.request || request
  onStatus("authorizing")
  const authorization = await send("/uploads/authorize", {
    method: "POST",
    token,
    body: JSON.stringify({
      kind,
      size: prepared.size,
      mime: prepared.type,
      context: { type: "sandbox" },
    }),
  })
  onStatus("uploading")
  const { error } = await client.storage
    .from(authorization.bucket)
    .uploadToSignedUrl(authorization.path, authorization.token, prepared, {
      contentType: prepared.type,
      upsert: false,
    })
  if (error) throw new Error("No se pudo subir el archivo. Inténtalo de nuevo.")
  onStatus("confirming")
  const result = await send("/uploads/confirm", {
    method: "POST",
    token,
    body: JSON.stringify({ receipt: authorization.receipt }),
  })
  onStatus("complete")
  return result
}

export function getPrivateDownload(fileId, token) {
  return request("/uploads/signed-download", {
    method: "POST",
    token,
    body: JSON.stringify({ fileId }),
  })
}

export function deleteStorageFile(fileId, token) {
  return request("/uploads", {
    method: "DELETE",
    token,
    body: JSON.stringify({ fileId }),
  })
}
