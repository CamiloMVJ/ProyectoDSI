import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/imagenes_lugares.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { imagenLugarSchema } from '../dtos/imagen_lugar.dto.js';
import { updateImagenLugarSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(imagenLugarSchema), crear);
router.patch('/:id', validate(updateImagenLugarSchema), actualizar);
export default router;
