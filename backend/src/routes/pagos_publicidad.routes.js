// Archivo: src/routes/pagos_publicidad.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/pagos_publicidad.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { pagoSchema } from '../dtos/pago.dto.js';
import { updatePagoSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador', 'Propietario']), listar);
router.get('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(pagoSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updatePagoSchema), actualizar);
export default router;