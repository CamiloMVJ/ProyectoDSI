// Archivo: src/routes/locales_comerciales.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/locales_comerciales.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { localComercialSchema } from '../dtos/local_comercial.dto.js';
import { updateLocalComercialSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(localComercialSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updateLocalComercialSchema), actualizar);
export default router;