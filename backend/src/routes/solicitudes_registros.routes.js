// Archivo: src/routes/solicitudes_registros.routes.js
import { Router } from 'express';
import { listar, listarMias, obtener, obtenerMiDocumento, obtenerDocumentoAdmin, crear, actualizar } from '../controllers/solicitudes_registros.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { solicitudRegistroSchema } from '../dtos/solicitud_registro.dto.js';
import { updateSolicitudRegistroSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador']), listar);
router.get('/mias', verifyToken, checkRole(['Usuario', 'Propietario']), listarMias);
router.get('/mias/:id/documentos/:documentId', verifyToken, checkRole(['Usuario', 'Propietario']), obtenerMiDocumento);
router.get('/:id/documentos/:documentId', verifyToken, checkRole(['Administrador']), obtenerDocumentoAdmin);
router.get('/:id', verifyToken, checkRole(['Administrador']), obtener);
router.post('/', verifyToken, checkRole(['Usuario', 'Propietario']), validate(solicitudRegistroSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateSolicitudRegistroSchema), actualizar);
export default router;
