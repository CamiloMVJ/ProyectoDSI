import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/menus.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { menuSchema } from '../dtos/Menus.dto.js';
import { updateMenuSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(menuSchema), crear);
router.patch('/:id', validate(updateMenuSchema), actualizar);
export default router;
