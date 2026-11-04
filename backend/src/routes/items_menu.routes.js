import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/items_menu.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { itemMenuSchema } from '../dtos/Items_Menu.dto.js';
import { updateItemMenuSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(itemMenuSchema), crear);
router.patch('/:id', validate(updateItemMenuSchema), actualizar);
export default router;
