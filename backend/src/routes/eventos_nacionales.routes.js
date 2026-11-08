// Archivo: src/routes/eventos_nacionales.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/eventos_nacionales.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { eventoSchema } from '../dtos/evento.dto.js';
import { updateEventoSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador']), validate(eventoSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateEventoSchema), actualizar);
export default router;