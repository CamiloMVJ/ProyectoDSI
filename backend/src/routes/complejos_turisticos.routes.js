import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/complejos_turisticos.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { complejoTuristicoSchema } from '../dtos/complejo_turistico.dto.js';
import { updateComplejoTuristicoSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(complejoTuristicoSchema), crear);
router.patch('/:id', validate(updateComplejoTuristicoSchema), actualizar);
export default router;
