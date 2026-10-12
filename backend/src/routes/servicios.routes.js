import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/servicios.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { servicioSchema } from '../dtos/servicio.dto.js';

const router = Router();

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(servicioSchema), crear);
router.put('/:id', validate(servicioSchema), actualizar);

export default router;