import * as service from '../services/resenas.service.js';

// Capa HTTP: delega la lógica de negocio al servicio existente.
export const listar = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findAll() }); }
  catch (error) { next(error); }
};

export const obtener = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findOne(req.params.id) }); }
  catch (error) { next(error); }
};

export const listarPublicasDelLocal = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findPublicByLocal(req.params.idLocal) }); }
  catch (error) { next(error); }
};

export const permisosDelLocal = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.permissions(req.params.idLocal, req.user.id) }); }
  catch (error) { next(error); }
};

export const crear = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.create(req.body, req.user) }); }
  catch (error) { next(error); }
};

export const responder = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.reply(req.params.id, req.body, req.user) }); }
  catch (error) { next(error); }
};

export const actualizar = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.update(req.params.id, req.body) }); }
  catch (error) { next(error); }
};
