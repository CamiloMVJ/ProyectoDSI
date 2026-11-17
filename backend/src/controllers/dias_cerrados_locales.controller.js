import * as service from '../services/dias_cerrados_locales.service.js'

export const listar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.findAll(req.params.id, req.user) }) }
  catch (error) { next(error) }
}

export const crear = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.create(req.params.id, req.body, req.user) }) }
  catch (error) { next(error) }
}

export const eliminar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.remove(req.params.id, req.params.cierreId, req.user) }) }
  catch (error) { next(error) }
}
