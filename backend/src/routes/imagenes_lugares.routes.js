// Archivo: src/routes/imagenes_lugares.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/imagenes_lugares.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { imagenLugarSchema } from '../dtos/imagen_lugar.dto.js';
import { updateImagenLugarSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(imagenLugarSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updateImagenLugarSchema), actualizar);
export default router;