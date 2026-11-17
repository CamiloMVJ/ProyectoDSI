import * as service from '../services/local_images.service.js'

export const listar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.findAll(req.params.id, req.user) }) }
  catch (error) { next(error) }
}

export const eliminar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.remove(req.params.id, req.params.imageId, req.user) }) }
  catch (error) { next(error) }
}
