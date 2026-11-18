const MAX_BYTES = 2097152
const ATTEMPTS = [
  { side: 1600, quality: 0.8 },
  { side: 1440, quality: 0.72 },
  { side: 1280, quality: 0.64 },
  { side: 1100, quality: 0.56 },
]

export async function prepareWebp(file, { bitmapFactory, canvasFactory } = {}) {
  if (
    !(file instanceof Blob) ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  ) {
    throw new Error("Selecciona una imagen JPEG, PNG o WebP.")
  }
  let bitmap
  try {
    const decode = bitmapFactory || createImageBitmap
    try {
      bitmap = await decode(file, { imageOrientation: "from-image" })
    } catch {
      bitmap = await decode(file)
    }
  } catch {
    throw new Error(
      "No se pudo abrir la imagen. Comprueba que el archivo no esté dañado.",
    )
  }
  try {
    if (!bitmap.width || !bitmap.height)
      throw new Error("La imagen no tiene dimensiones válidas.")
    for (const { side, quality } of ATTEMPTS) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height))
      const width = Math.max(1, Math.round(bitmap.width * scale))
      const height = Math.max(1, Math.round(bitmap.height * scale))
      const canvas = canvasFactory
        ? canvasFactory(width, height)
        : typeof OffscreenCanvas !== "undefined"
          ? new OffscreenCanvas(width, height)
          : Object.assign(document.createElement("canvas"), { width, height })
      try {
        const context = canvas.getContext("2d", { alpha: true })
        if (!context)
          throw new Error("No se pudo procesar la imagen en este navegador.")
        context.drawImage(bitmap, 0, 0, width, height)
        const blob = canvas.convertToBlob
          ? await canvas.convertToBlob({ type: "image/webp", quality })
          : await new Promise((resolve) =>
              canvas.toBlob(resolve, "image/webp", quality),
            )
        if (!blob || blob.type !== "image/webp")
          throw new Error("El navegador no admite la conversión a WebP.")
        if (blob.size <= MAX_BYTES) {
          const baseName = (file.name || "imagen")
            .replace(/\.[^.]+$/, "")
            .replace(/[^\p{L}\p{N}_-]/gu, "_")
            .slice(0, 80)
          return new File([blob], `${baseName || "imagen"}.webp`, {
            type: "image/webp",
          })
        }
      } finally {
        canvas.width = 0
        canvas.height = 0
      }
    }
    throw new Error("La imagen sigue superando 2 MB después de comprimirla.")
  } finally {
    bitmap.close?.()
  }
}
