// Archivo: src/routes/turistas.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/turistas.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { turistaSchema } from '../dtos/turista.dto.js';
import { updateTuristaSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador']), listar);
router.get('/:id', verifyToken, checkRole(['Administrador', 'Turista']), obtener);
router.post('/', validate(turistaSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Turista']), validate(updateTuristaSchema), actualizar);
export default router;