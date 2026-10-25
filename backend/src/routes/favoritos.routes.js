import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/favoritos.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { favoritoSchema } from '../dtos/favorito.dto.js';
import { updateFavoritoSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(favoritoSchema), crear);
router.patch('/:id', validate(updateFavoritoSchema), actualizar);
export default router;
