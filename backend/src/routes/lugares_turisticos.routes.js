// Archivo: src/routes/lugares_turisticos.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar, buscar } from '../controllers/lugares_turisticos.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { lugarSchema } from '../dtos/lugar.dto.js';
import { updateLugarSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/buscar', buscar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador']), validate(lugarSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateLugarSchema), actualizar);
export default router;
