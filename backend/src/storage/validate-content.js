import sharp from "sharp"
import { PDFDocument } from "pdf-lib"
import { AppError } from "../errors/app-error.js"

export async function validateFileContent(buffer, kind, maxBytes) {
  if (
    !Buffer.isBuffer(buffer) ||
    buffer.length === 0 ||
    buffer.length > maxBytes
  ) {
    throw new AppError(
      "El archivo está vacío o supera el límite permitido",
      400,
    )
  }
  if (kind === "image") {
    if (
      buffer.toString("ascii", 0, 4) !== "RIFF" ||
      buffer.toString("ascii", 8, 12) !== "WEBP" ||
      buffer.readUInt32LE(4) + 8 !== buffer.length
    ) {
      throw new AppError("La imagen no es un WebP válido", 400)
    }
    try {
      const image = sharp(buffer, {
        limitInputPixels: 1600 * 1600,
        failOn: "error",
      })
      const metadata = await image.metadata()
      if (
        metadata.format !== "webp" ||
        !metadata.width ||
        !metadata.height ||
        Math.max(metadata.width, metadata.height) > 1600
      )
        throw new Error("Dimensiones inválidas")
      await image.resize(1, 1).toBuffer()
      return { mime: "image/webp", size: buffer.length }
    } catch {
      throw new AppError(
        "La imagen WebP está dañada o supera las dimensiones permitidas",
        400,
      )
    }
  }
  if (kind === "document") {
    if (
      buffer.toString("ascii", 0, 5) !== "%PDF-" ||
      !buffer
        .subarray(Math.max(0, buffer.length - 2048))
        .includes(Buffer.from("%%EOF"))
    ) {
      throw new AppError("El documento no es un PDF válido", 400)
    }
    try {
      const pdf = await PDFDocument.load(buffer, {
        throwOnInvalidObject: true,
        updateMetadata: false,
      })
      if (pdf.getPageCount() < 1) throw new Error("Sin páginas")
      return { mime: "application/pdf", size: buffer.length }
    } catch {
      throw new AppError("El PDF está dañado o no se puede leer", 400)
    }
  }
  throw new AppError("Tipo de archivo no permitido", 400)
}

export async function readStorageFile(
  client,
  bucket,
  path,
  maxBytes,
  projectUrl,
  fetcher = fetch,
) {
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, 60)
  if (error || !data?.signedUrl)
    throw new AppError("Archivo no encontrado", 404)
  const signedUrl = new URL(data.signedUrl)
  const projectHost = new URL(projectUrl).hostname
  const storageHost = projectHost.replace(
    ".supabase.co",
    ".storage.supabase.co",
  )
  if (
    signedUrl.protocol !== "https:" ||
    ![projectHost, storageHost].includes(signedUrl.hostname)
  ) {
    throw new AppError("Respuesta inválida del almacenamiento", 502)
  }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  timeout.unref?.()
  try {
    let response
    try { response = await fetcher(signedUrl, { signal: controller.signal }) }
    catch { throw new AppError('No se pudo consultar el archivo', 502) }
    if (!response.ok || !response.body) throw new AppError('Archivo no encontrado', 404)
    const chunks = []
    let length = 0
    for await (const chunk of response.body) {
      length += chunk.byteLength
      if (length > maxBytes) {
        controller.abort()
        throw new AppError("El archivo supera el límite permitido", 400)
      }
      chunks.push(Buffer.from(chunk))
    }
    return Buffer.concat(chunks, length)
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError('No se pudo leer el archivo completo', 502)
  } finally {
    clearTimeout(timeout)
  }
}
