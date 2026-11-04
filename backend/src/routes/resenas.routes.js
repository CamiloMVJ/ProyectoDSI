import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/resenas.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { resenaSchema } from '../dtos/resena.dto.js';
import { updateResenaSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(resenaSchema), crear);
router.patch('/:id', validate(updateResenaSchema), actualizar);
export default router;
