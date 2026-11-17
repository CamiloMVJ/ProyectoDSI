import * as repository from '../repositories/gestion_establecimientos.repository.js'
import * as departamentos from '../repositories/departamentos.repository.js'
import * as complejos from '../repositories/complejos_turisticos.repository.js'
import * as categoriasMenu from '../repositories/menu-categories.repository.js'
import { AppError } from '../errors/app-error.js'
import { execute, parseId, requireReference, withTransaction } from './service-utils.js'

export function findAll(user) {
  return execute(() => repository.findAll(user.id, user.rol === 'Administrador'))
}

export function save(id, data, user) {
  id = parseId(id)
  if (data.horarios) {
    const ids = data.horarios.map(horario => horario.id_horario).filter(Boolean)
    if (new Set(ids).size !== ids.length) throw new AppError('Hay horarios repetidos', 400)
  }
  if (data.menus) {
    const menuIds = data.menus.map(menu => menu.id_menu).filter(Boolean)
    const itemIds = data.menus.flatMap(menu => menu.items.map(item => item.id_item).filter(Boolean))
    if (new Set(menuIds).size !== menuIds.length || new Set(itemIds).size !== itemIds.length)
      throw new AppError('Hay menús o platillos repetidos', 400)
  }
  return execute(() => withTransaction(async client => {
    if (!await repository.lock(id, user.id, user.rol === 'Administrador', client)) throw new AppError('El establecimiento no existe', 404)
    await requireReference(departamentos, data.id_departamento, 'El departamento', client)
    if (!data.es_independiente) await requireReference(complejos, data.id_complejo_padre, 'El complejo', client)
    if (data.menus) {
      const idsCategorias = new Set(data.menus.flatMap(menu => menu.items.map(item => item.id_categoria_menu)))
      for (const idCategoria of idsCategorias) {
        await requireReference(categoriasMenu, idCategoria, 'La categoría del menú', client)
      }
    }
    const result = await repository.save(id, data, client)
    if (!result) throw new AppError('Un horario, servicio, menú o platillo ya no pertenece a este establecimiento', 409)
    return result
  }))
}
