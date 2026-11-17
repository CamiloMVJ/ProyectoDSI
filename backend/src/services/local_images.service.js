import * as images from '../storage/local-images.repository.js'
import { storageConfig } from '../storage/config.js'
import { getStorageClient } from '../storage/client.js'
import { AppError } from '../errors/app-error.js'
import { execute, parseId, withTransaction } from './service-utils.js'

const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

export function findAll(localId, user) {
  localId = parseId(localId)
  return execute(async () => {
    const admin = user.rol === 'Administrador'
    if (!await images.findManagedLocal(localId, user.id, admin))
      throw new AppError('El establecimiento no existe', 404)
    return images.findAll(localId, user.id, admin)
  })
}

export function remove(localId, imageId, user) {
  localId = parseId(localId)
  imageId = parseId(imageId)
  return execute(() => withTransaction(async (db) => {
    const image = await images.findOwnedImage(localId, imageId, user.id, user.rol === 'Administrador', db)
    if (!image) throw new AppError('La imagen no existe', 404)

    // Solo se elimina del bucket un objeto generado por este flujo; las URL antiguas
    // pueden apuntar a otro proveedor y únicamente se desvinculan de la base de datos.
    const match = typeof image.url_imagen === 'string'
      ? image.url_imagen.match(new RegExp(`/storage/v1/object/public/[^/]+/(final/locales/${localId}/\\d+/${uuid}\\.webp)$`, 'i'))
      : null
    if (match) {
      const config = storageConfig()
      const storage = getStorageClient(config).storage.from(config.images)
      const expected = storage.getPublicUrl(match[1]).data.publicUrl
      if (image.url_imagen === expected) {
        const { error } = await storage.remove([match[1]])
        if (error) throw new AppError('No se pudo eliminar el archivo', 502)
      }
    }
    await images.deleteImage(localId, imageId, db)
    return { id_imagen: imageId }
  }))
}
