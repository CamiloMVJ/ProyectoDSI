// Archivo: src/routes/favoritos.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/favoritos.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { favoritoSchema } from '../dtos/favorito.dto.js';
import { updateFavoritoSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Turista', 'Administrador']), listar);
router.get('/:id', verifyToken, checkRole(['Turista', 'Administrador']), obtener);
router.post('/', verifyToken, checkRole(['Turista']), validate(favoritoSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Turista']), validate(updateFavoritoSchema), actualizar);
export default router;