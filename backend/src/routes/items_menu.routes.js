// Archivo: src/routes/items_menu.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/items_menu.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { itemMenuSchema } from './../dtos/Items_Menu.dto.js';
import { updateItemMenuSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(itemMenuSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updateItemMenuSchema), actualizar);
export default router;