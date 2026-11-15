// Archivo: src/routes/propietarios_negocios.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar, getByUserId } from '../controllers/propietarios_negocios.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { propietarioNegocioSchema } from '../dtos/propietario_negocio.dto.js';
import { updatePropietarioNegocioSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador']), listar);
router.get('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), obtener);
router.get('/user/:id', verifyToken, checkRole(['Administrador', 'Propietario']), getByUserId);
router.post('/', validate(propietarioNegocioSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updatePropietarioNegocioSchema), actualizar);
export default router;