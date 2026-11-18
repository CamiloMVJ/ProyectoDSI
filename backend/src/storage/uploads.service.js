import { randomUUID } from "node:crypto"
import { AppError } from "../errors/app-error.js"
import { storageConfig } from "./config.js"
import { getStorageClient } from "./client.js"
import { authorizeStorage } from "./policy.js"
import { signReceipt, verifyReceipt } from "./receipt.js"
import { limitAuthorizations } from "./rate-limit.js"
import { readStorageFile, validateFileContent } from "./validate-content.js"
import * as businessDocuments from "./business-documents.repository.js"
import * as localImages from "./local-images.repository.js"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const mimeFor = { image: "image/webp", document: "application/pdf" }
const extensionFor = { image: "webp", document: "pdf" }
const ownPath = (stage, userId, id, kind, scope = "sandbox", requestId, localId) =>
  scope === "business-request"
    ? `${stage}/solicitudes/${requestId}/${userId}/${id}.pdf`
    : scope === "local-image"
      ? `${stage}/locales/${localId}/${userId}/${id}.webp`
    : `${stage}/sandbox/${userId}/${id}.${extensionFor[kind]}`

function dependencies(deps = {}) {
  const config = deps.config || storageConfig()
  return {
    config,
    client: deps.client || getStorageClient(config),
    fetcher: deps.fetcher || fetch,
    business: deps.business || businessDocuments,
    localImages: deps.localImages || localImages,
  }
}

function checkedReference(token, expectedStage, user, config) {
  const ref = verifyReceipt(token, config.receiptSecret)
  if (
    ref.stage !== expectedStage ||
    !["sandbox", "business-request", "local-image"].includes(ref.scope) ||
    !UUID.test(ref.id || "") ||
    !mimeFor[ref.kind] ||
    (ref.scope === "business-request" &&
      (ref.kind !== "document" ||
        !Number.isSafeInteger(ref.requestId) ||
        ref.requestId <= 0 ||
        ref.requestId > 2147483647 ||
        !["RUC", "Permiso", "Cédula de Identidad", "Constancia RUC", "Permiso o Constancia"].includes(ref.documentType) ||
        typeof ref.fileName !== "string" ||
        !ref.fileName ||
        ref.fileName.length > 255)) ||
    (ref.scope === "local-image" &&
      (ref.kind !== "image" ||
        !Number.isSafeInteger(ref.localId) ||
        ref.localId <= 0 ||
        ref.localId > 2147483647)) ||
    !Number.isSafeInteger(ref.userId) ||
    ref.userId <= 0 ||
    ref.path !==
      ownPath(
        expectedStage,
        ref.userId,
        ref.id,
        ref.kind,
        ref.scope,
        ref.requestId,
        ref.localId,
      ) ||
    ref.bucket !==
      (ref.kind === "image"
        ? expectedStage === "pending"
          ? config.staging
          : config.images
        : config.documents)
  ) {
    throw new AppError("Referencia de archivo inválida", 400)
  }
  authorizeStorage(
    user,
    expectedStage === "pending" ? "confirm" : "download",
    ref,
    config,
  )
  return ref
}

export async function authorizeUpload(user, input, deps) {
  const { config, client, business, localImages } = dependencies(deps)
  const context = input?.context
  if (!["sandbox", "business-request", "local-image"].includes(context?.type))
    throw new AppError("Contexto de archivo no permitido", 400)
  authorizeStorage(
    user,
    "authorize",
    { scope: context.type, userId: user.id },
    config,
  )
  const { kind, size, mime } = input
  if (context.type === "business-request") {
    if (
      kind !== "document" ||
      !Number.isSafeInteger(context.requestId) ||
      context.requestId <= 0 ||
      context.requestId > 2147483647 ||
      !["RUC", "Permiso", "Cédula de Identidad", "Constancia RUC", "Permiso o Constancia"].includes(context.documentType) ||
      typeof context.fileName !== "string" ||
      !context.fileName.trim() ||
      context.fileName.length > 255
    ) {
      throw new AppError("Datos del documento inválidos", 400)
    }
    if (!(await business.findOwnedPendingRequest(context.requestId, user.id)))
      throw new AppError(
        "La solicitud pendiente no existe o no te pertenece",
        403,
      )
  }
  if (context.type === "local-image") {
    if (kind !== "image" || !Number.isSafeInteger(context.localId) || context.localId <= 0 || context.localId > 2147483647)
      throw new AppError("Datos de la imagen inválidos", 400)
    if (!(await localImages.findManagedLocal(context.localId, user.id, user.rol === "Administrador")))
      throw new AppError("El establecimiento no existe o no te pertenece", 403)
  }
  const max = kind === "image" ? config.imageMax : config.documentMax
  if (
    !mimeFor[kind] ||
    mime !== mimeFor[kind] ||
    !Number.isSafeInteger(size) ||
    size < 1 ||
    size > max
  ) {
    throw new AppError("Formato o tamaño de archivo no permitido", 400)
  }
  if (kind === "image" && !config.staging)
    throw new AppError("Falta un bucket privado de staging para imágenes", 503)
  limitAuthorizations(user.id, user.rol)
  const id = randomUUID()
  const bucket = kind === "image" ? config.staging : config.documents
  const path = ownPath(
    "pending",
    user.id,
    id,
    kind,
    context.type,
    context.requestId,
    context.localId,
  )
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(path, { upsert: false })
  if (error || !data?.token)
    throw new AppError("No se pudo autorizar la subida", 502)
  const receipt = signReceipt(
    {
      stage: "pending",
      scope: context.type,
      ...(context.type === "business-request"
        ? {
            requestId: context.requestId,
            documentType: context.documentType,
            fileName: context.fileName.trim(),
          }
        : {}),
      ...(context.type === "local-image" ? { localId: context.localId } : {}),
      userId: user.id,
      kind,
      id,
      bucket,
      path,
      size,
      mime,
      exp: Date.now() + 2 * 60 * 60 * 1000,
    },
    config.receiptSecret,
  )
  return { bucket, path, token: data.token, receipt, maxBytes: max }
}

export async function confirmUpload(user, receipt, deps) {
  const { config, client, fetcher, business, localImages } = dependencies(deps)
  const ref = checkedReference(receipt, "pending", user, config)
  if (
    ref.scope === "business-request" &&
    !(await business.findOwnedPendingRequest(ref.requestId, user.id))
  )
    throw new AppError(
      "La solicitud pendiente no existe o no te pertenece",
      403,
    )
  if (ref.scope === "local-image" &&
    !(await localImages.findManagedLocal(ref.localId, user.id, user.rol === "Administrador")))
    throw new AppError("El establecimiento no existe o no te pertenece", 403)
  const max = ref.kind === "image" ? config.imageMax : config.documentMax
  if (
    !Number.isSafeInteger(ref.size) ||
    ref.size < 1 ||
    ref.size > max ||
    ref.mime !== mimeFor[ref.kind]
  ) {
    throw new AppError("Comprobante de archivo inválido", 400)
  }
  const source = client.storage.from(ref.bucket)
  const { data: info, error: infoError } = await source.info(ref.path)
  if (infoError || !info)
    throw new AppError("La subida no existe o está incompleta", 404)
  if (Number(info.size) !== ref.size || info.contentType !== ref.mime) {
    throw new AppError("El archivo subido no coincide con la autorización", 400)
  }
  const buffer = await readStorageFile(
    client,
    ref.bucket,
    ref.path,
    max,
    config.url,
    fetcher,
  )
  if (buffer.length !== ref.size)
    throw new AppError("La subida está incompleta", 400)
  await validateFileContent(buffer, ref.kind, max)
  const finalPath = ownPath(
    "final",
    ref.userId,
    ref.id,
    ref.kind,
    ref.scope,
    ref.requestId,
    ref.localId,
  )
  const finalBucket = ref.kind === "image" ? config.images : config.documents
  let savedImage
  if (ref.kind === "image") {
    const { error } = await client.storage
      .from(finalBucket)
      .upload(finalPath, buffer, {
        contentType: ref.mime,
        cacheControl: "31536000",
        upsert: false,
      })
    if (error) throw new AppError("No se pudo publicar la imagen validada", 502)
    if (ref.scope === "local-image") {
      const url = client.storage.from(finalBucket).getPublicUrl(finalPath).data.publicUrl
      try {
        savedImage = await localImages.saveImage(ref.localId, user.id, user.rol === "Administrador", url)
        if (!savedImage) throw new AppError("El establecimiento ya no está disponible", 409)
      } catch (saveError) {
        await client.storage.from(finalBucket).remove([finalPath])
        throw saveError
      }
    }
    // Un fallo de limpieza deja solo una copia privada pendiente, nunca una publicación sin validar.
    await source.remove([ref.path])
  } else {
    const { error } = await source.move(ref.path, finalPath)
    if (error) throw new AppError("No se pudo confirmar el documento", 502)
    if (ref.scope === "business-request") {
      try {
        const saved = await business.saveRequestDocument(
          ref.requestId,
          ref.userId,
          ref.fileName,
          ref.documentType,
          finalPath,
        )
        if (!saved)
          throw new AppError("La solicitud ya no admite documentos", 409)
      } catch (saveError) {
        await source.move(finalPath, ref.path)
        throw saveError
      }
    }
  }
  const fileId = signReceipt(
    {
      stage: "final",
      scope: ref.scope,
      ...(ref.scope === "business-request"
        ? {
            requestId: ref.requestId,
            documentType: ref.documentType,
            fileName: ref.fileName,
          }
        : {}),
      ...(ref.scope === "local-image" ? { localId: ref.localId } : {}),
      userId: ref.userId,
      kind: ref.kind,
      id: ref.id,
      bucket: finalBucket,
      path: finalPath,
    },
    config.receiptSecret,
  )
  const result = { fileId, kind: ref.kind }
  if (ref.kind === "image")
    result.publicUrl = client.storage
      .from(finalBucket)
      .getPublicUrl(finalPath).data.publicUrl
  if (savedImage) result.image = savedImage
  return result
}

export async function signedDownload(user, fileId, deps) {
  const { config, client, business } = dependencies(deps)
  const ref = checkedReference(fileId, "final", user, config)
  if (
    ref.scope === "business-request" &&
    !(await business.findOwnedRequest(ref.requestId, user.id))
  )
    throw new AppError("La solicitud no existe o no te pertenece", 403)
  if (ref.kind !== "document")
    throw new AppError(
      "Solo los documentos privados admiten descarga firmada",
      400,
    )
  const { data, error } = await client.storage
    .from(ref.bucket)
    .createSignedUrl(ref.path, 60)
  if (error || !data?.signedUrl)
    throw new AppError("Documento no encontrado", 404)
  return { url: data.signedUrl, expiresIn: 60 }
}

export async function signedRequestDocument(user, requestId, documentId, deps) {
  const { config, client, business } = dependencies(deps)
  if (!["Usuario", "Propietario"].includes(user?.rol))
    throw new AppError("No tenés permiso para ver este documento", 403)
  const document = await business.findOwnedDocument(
    requestId,
    documentId,
    user.id,
  )
  if (!document) throw new AppError("Documento no encontrado", 404)
  return signRequestDocument(document, requestId, user.id, config, client)
}

export async function signedAdminRequestDocument(user, requestId, documentId, deps) {
  const { config, client, business } = dependencies(deps)
  if (user?.rol !== "Administrador")
    throw new AppError("No tenés permiso para ver este documento", 403)
  const document = await business.findRequestDocumentForAdmin(requestId, documentId)
  if (!document) throw new AppError("Documento no encontrado", 404)
  return signRequestDocument(document, requestId, document.id_usuario, config, client)
}

async function signRequestDocument(document, requestId, userId, config, client) {
  const escapedPath = `final/solicitudes/${requestId}/${userId}/`
  if (
    typeof document.url_archivo !== "string" ||
    !document.url_archivo.startsWith(escapedPath) ||
    !UUID.test(document.url_archivo.slice(escapedPath.length, -4)) ||
    !document.url_archivo.endsWith(".pdf")
  )
    throw new AppError("Referencia de documento inválida", 404)
  const { data, error } = await client.storage
    .from(config.documents)
    .createSignedUrl(document.url_archivo, 60)
  if (error || !data?.signedUrl)
    throw new AppError("Documento no encontrado", 404)
  return { url: data.signedUrl, expiresIn: 60 }
}

export async function deleteUpload(user, fileId, deps) {
  const { config, client } = dependencies(deps)
  const ref = checkedReference(fileId, "final", user, config)
  if (ref.scope === "local-image") throw new AppError("Elimina la imagen desde el establecimiento", 400)
  authorizeStorage(user, "delete", ref, config)
  const store = client.storage.from(ref.bucket)
  const { error: infoError } = await store.info(ref.path)
  if (infoError) throw new AppError("Archivo no encontrado", 404)
  const { error } = await store.remove([ref.path])
  if (error) throw new AppError("No se pudo eliminar el archivo", 502)
  return { deleted: true }
}

export function publicImageUrl(
  fileId,
  config = storageConfig(),
  client = getStorageClient(config),
) {
  const ref = verifyReceipt(fileId, config.receiptSecret)
  if (
    ref.stage !== "final" ||
    ref.kind !== "image" ||
    ref.bucket !== config.images ||
    ref.path !== ownPath("final", ref.userId, ref.id, ref.kind)
  ) {
    throw new AppError("Referencia de imagen inválida", 400)
  }
  return client.storage.from(ref.bucket).getPublicUrl(ref.path).data.publicUrl
}
