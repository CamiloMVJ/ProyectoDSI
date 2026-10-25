import * as service from '../services/eventos_nacionales.service.js';

// Capa HTTP: delega la lógica de negocio al servicio existente.
export const listar = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findAll() }); }
  catch (error) { next(error); }
};

export const obtener = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findOne(req.params.id) }); }
  catch (error) { next(error); }
};

export const crear = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.create(req.body) }); }
  catch (error) { next(error); }
};

export const actualizar = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.update(req.params.id, req.body) }); }
  catch (error) { next(error); }
};
