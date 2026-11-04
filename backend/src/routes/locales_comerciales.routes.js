import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/locales_comerciales.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { localComercialSchema } from '../dtos/local_comercial.dto.js';
import { updateLocalComercialSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(localComercialSchema), crear);
router.patch('/:id', validate(updateLocalComercialSchema), actualizar);
export default router;
