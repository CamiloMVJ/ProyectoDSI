import * as service from '../services/gestion_lugares.service.js'

export const listar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.findAll() }) }
  catch (error) { next(error) }
}

export const obtener = async (req, res, next) => {
  try { res.json({ success: true, data: await service.findOne(req.params.id) }) }
  catch (error) { next(error) }
}

export const administradores = async (req, res, next) => {
  try { res.json({ success: true, data: await service.findAdministrators() }) }
  catch (error) { next(error) }
}

export const guardar = async (req, res, next) => {
  try { res.json({ success: true, data: await service.save(req.params.id, req.body) }) }
  catch (error) { next(error) }
}
