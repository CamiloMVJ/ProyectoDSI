// Archivo: src/routes/resenas.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/resenas.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { resenaSchema } from '../dtos/resena.dto.js';
import { updateResenaSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Turista']), validate(resenaSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario', 'Turista']), validate(updateResenaSchema), actualizar);
export default router;