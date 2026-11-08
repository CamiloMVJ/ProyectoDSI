import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/atractivos_independientes.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { atractivoIndependienteSchema } from '../dtos/atractivos_independientes.dto.js';
import { updateAtractivoIndependienteSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador']), validate(atractivoIndependienteSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateAtractivoIndependienteSchema), actualizar);
export default router;
