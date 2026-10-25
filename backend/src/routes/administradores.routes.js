import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/administradores.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { administradorSchema } from '../dtos/administradores.dto.js';
import { updateAdministradorSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(administradorSchema), crear);
router.patch('/:id', validate(updateAdministradorSchema), actualizar);
export default router;
