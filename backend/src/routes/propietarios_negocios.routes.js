import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/propietarios_negocios.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { propietarioNegocioSchema } from '../dtos/propietario_negocio.dto.js';
import { updatePropietarioNegocioSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(propietarioNegocioSchema), crear);
router.patch('/:id', validate(updatePropietarioNegocioSchema), actualizar);
export default router;
