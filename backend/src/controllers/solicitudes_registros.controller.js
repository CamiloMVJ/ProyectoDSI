import * as service from '../services/solicitudes_registros.service.js';

// Capa HTTP: delega la lógica de negocio al servicio existente.
export const listar = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findAll() }); }
  catch (error) { next(error); }
};

export const listarMias = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findMine(req.user.id) }); }
  catch (error) { next(error); }
};

export const obtenerMiDocumento = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.getMyDocument(req.user, req.params.id, req.params.documentId) }); }
  catch (error) { next(error); }
};

export const obtenerDocumentoAdmin = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.getAdminDocument(req.user, req.params.id, req.params.documentId) }); }
  catch (error) { next(error); }
};

export const obtener = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.findOne(req.params.id) }); }
  catch (error) { next(error); }
};

export const crear = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.create(req.body, req.user.id) }); }
  catch (error) { next(error); }
};

export const actualizar = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.update(req.params.id, req.body) }); }
  catch (error) { next(error); }
};
