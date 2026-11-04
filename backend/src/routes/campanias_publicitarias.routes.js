// Archivo: src/routes/campanias_publicitarias.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/campanias_publicitarias.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { campaniaSchema } from '../dtos/campania.dto.js';
import { updateCampaniaSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador', 'Propietario']), listar);
router.get('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(campaniaSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updateCampaniaSchema), actualizar);
export default router;