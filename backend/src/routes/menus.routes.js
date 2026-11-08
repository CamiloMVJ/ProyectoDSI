// Archivo: src/routes/menus.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/menus.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { menuSchema } from '../dtos/menus.dto.js';
import { updateMenuSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(menuSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updateMenuSchema), actualizar);
export default router;