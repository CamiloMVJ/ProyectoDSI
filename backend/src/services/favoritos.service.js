import * as repository from '../repositories/favoritos.repository.js'
import * as localesRepository from '../repositories/locales.repository.js'
import { AppError } from '../errors/app-error.js'
import { execute, parseId, requireReference } from './service-utils.js'

export async function findByUser(idUsuario) {
  return execute(() => repository.findByUser(parseId(idUsuario)))
}

export async function create(idUsuario, idLocal) {
  idUsuario = parseId(idUsuario)
  idLocal = parseId(idLocal)
  return execute(async () => {
    await requireReference(localesRepository, idLocal, 'El local')
    return repository.create(idUsuario, idLocal)
  })
}

export async function remove(idFavorito, idUsuario) {
  idFavorito = parseId(idFavorito)
  idUsuario = parseId(idUsuario)
  return execute(async () => {
    const deleted = await repository.remove(idFavorito, idUsuario)
    if (!deleted) throw new AppError('El favorito no existe', 404)
    return { mensaje: 'Favorito eliminado correctamente', id_favorito: deleted.id_favorito }
  })
}
