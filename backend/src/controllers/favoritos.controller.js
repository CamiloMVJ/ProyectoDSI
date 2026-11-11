import * as service from '../services/favoritos.service.js'

export const listar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.findByUser(req.user.id) }) }
  catch (error) { next(error) }
}

export const crear = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.create(req.user.id, req.body.id_local) }) }
  catch (error) { next(error) }
}

export const eliminar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.remove(req.params.id, req.user.id) }) }
  catch (error) { next(error) }
}
