// Archivo: src/routes/servicios.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/servicios.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { servicioSchema } from '../dtos/servicio.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(servicioSchema), crear);
router.put('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(servicioSchema), actualizar);

export default router;