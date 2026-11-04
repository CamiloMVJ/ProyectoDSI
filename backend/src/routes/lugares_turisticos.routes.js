import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/lugares_turisticos.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { lugarSchema } from '../dtos/lugar.dto.js';
import { updateLugarSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(lugarSchema), crear);
router.patch('/:id', validate(updateLugarSchema), actualizar);
export default router;
