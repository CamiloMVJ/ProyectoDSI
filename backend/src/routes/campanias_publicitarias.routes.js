import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/campanias_publicitarias.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { campaniaSchema } from '../dtos/campania.dto.js';
import { updateCampaniaSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(campaniaSchema), crear);
router.patch('/:id', validate(updateCampaniaSchema), actualizar);
export default router;
