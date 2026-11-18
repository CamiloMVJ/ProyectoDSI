import * as service from '../services/locales_categorias.service.js'

export const listarTodos = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findAll() }) }
  catch (error) { next(error) }
}

export const listarPorLocal = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findByLocal(req.params.idLocal, 'local') }) }
  catch (error) { next(error) }
}

export const crearAsociacion = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.create(req.body.id_local, req.body.id_categoria, 'local') }) }
  catch (error) { next(error) }
}

export const eliminarAsociacion = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.remove(req.params.idLocal, req.params.idCategoria, 'local') }) }
  catch (error) { next(error) }
}

export function controllerFor(tipo) {
  return {
    async listar(req, res, next) {
      try { res.status(200).json({ success: true, data: await service.findByLocal(req.params.id, tipo) }) }
      catch (error) { next(error) }
    },
    async crear(req, res, next) {
      try {
        res.status(201).json({ success: true, data: await service.create(req.params.id, req.body.id_categoria, tipo) })
      } catch (error) { next(error) }
    },
    async eliminar(req, res, next) {
      try {
        res.status(200).json({ success: true, data: await service.remove(req.params.id, req.params.idCategoria, tipo) })
      } catch (error) { next(error) }
    }
  }
}
