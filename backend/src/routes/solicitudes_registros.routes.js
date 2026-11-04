// Archivo: src/routes/solicitudes_registros.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/solicitudes_registros.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { solicitudRegistroSchema } from '../dtos/solicitud_registro.dto.js';
import { updateSolicitudRegistroSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador', 'Propietario']), listar);
router.get('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), obtener);
router.post('/', verifyToken, checkRole(['Propietario']), validate(solicitudRegistroSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateSolicitudRegistroSchema), actualizar);
export default router;