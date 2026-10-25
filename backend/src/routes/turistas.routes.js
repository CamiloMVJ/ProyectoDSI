import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/turistas.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { turistaSchema } from '../dtos/turista.dto.js';
import { updateTuristaSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(turistaSchema), crear);
router.patch('/:id', validate(updateTuristaSchema), actualizar);
export default router;
