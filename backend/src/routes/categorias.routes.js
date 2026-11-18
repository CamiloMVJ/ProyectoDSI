// Archivo: src/routes/categorias.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/categorias.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { categoriaSchema } from '../dtos/categoria.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador']), validate(categoriaSchema), crear);
router.put('/:id', verifyToken, checkRole(['Administrador']), validate(categoriaSchema), actualizar);
export default router;