// Archivo: src/routes/complejos_turisticos.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/complejos_turisticos.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { complejoTuristicoSchema } from '../dtos/complejo_turistico.dto.js';
import { updateComplejoTuristicoSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(complejoTuristicoSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updateComplejoTuristicoSchema), actualizar);
export default router;