import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/horarios.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { horarioSchema } from '../dtos/horario.dto.js';
import { updateHorarioSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(horarioSchema), crear);
router.patch('/:id', validate(updateHorarioSchema), actualizar);
export default router;
