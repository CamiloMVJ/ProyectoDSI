import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/eventos_nacionales.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { eventoSchema } from '../dtos/evento.dto.js';
import { updateEventoSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(eventoSchema), crear);
router.patch('/:id', validate(updateEventoSchema), actualizar);
export default router;
