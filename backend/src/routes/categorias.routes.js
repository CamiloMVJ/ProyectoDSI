import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/categorias.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { categoriaSchema } from '../dtos/categoria.dto.js';

const router = Router();

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(categoriaSchema), crear);
router.put('/:id', validate(categoriaSchema), actualizar);

export default router;