import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/atractivos_independientes.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { atractivoIndependienteSchema } from '../dtos/atractivos_independientes.dto.js';
import { updateAtractivoIndependienteSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(atractivoIndependienteSchema), crear);
router.patch('/:id', validate(updateAtractivoIndependienteSchema), actualizar);
export default router;
