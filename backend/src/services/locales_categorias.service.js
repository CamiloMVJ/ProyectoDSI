import * as repository from '../repositories/locales_categorias.repository.js'
import * as lugaresRepository from '../repositories/lugares_turisticos.repository.js'
import * as comercialesRepository from '../repositories/locales_comerciales.repository.js'
import * as localesRepository from '../repositories/locales.repository.js'
import * as categoriasRepository from '../repositories/categorias.repository.js'
import { AppError } from '../errors/app-error.js'
import { execute, parseId } from './service-utils.js'

async function requireParent(idLocal, tipo) {
  const parentRepository = tipo === 'lugar' ? lugaresRepository : tipo === 'comercial' ? comercialesRepository : localesRepository
  const parent = await parentRepository.findOne(idLocal)
  if (!parent) throw new AppError(tipo === 'lugar' ? 'El lugar no existe' : tipo === 'comercial' ? 'El local comercial no existe' : 'El local no existe', 404)
}

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findByLocal(idLocal, tipo) {
  idLocal = parseId(idLocal)
  return execute(async () => {
    await requireParent(idLocal, tipo)
    return repository.findByLocal(idLocal)
  })
}

export async function create(idLocal, idCategoria, tipo) {
  idLocal = parseId(idLocal)
  idCategoria = parseId(idCategoria)
  return execute(async () => {
    await requireParent(idLocal, tipo)
    const categoria = await categoriasRepository.findOne(idCategoria)
    if (!categoria) throw new AppError('La categoría no existe', 404)
    await repository.create(idLocal, idCategoria)
    return { id_local: idLocal, ...categoria }
  })
}

export async function remove(idLocal, idCategoria, tipo) {
  idLocal = parseId(idLocal)
  idCategoria = parseId(idCategoria)
  return execute(async () => {
    await requireParent(idLocal, tipo)
    const result = await repository.remove(idLocal, idCategoria)
    if (!result) throw new AppError('La categoría no está asociada a este local', 404)
    return result
  })
}
