import * as service from '../services/gestion_establecimientos.service.js'

export const listar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.findAll(req.user) }) }
  catch (error) { next(error) }
}
export const guardar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.save(req.params.id, req.body, req.user) }) }
  catch (error) { next(error) }
}
