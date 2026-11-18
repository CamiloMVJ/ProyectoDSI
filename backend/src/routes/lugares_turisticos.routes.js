// Archivo: src/routes/lugares_turisticos.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar, buscar } from '../controllers/lugares_turisticos.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { lugarSchema } from '../dtos/lugar.dto.js';
import { updateLugarSchema } from '../dtos/update.dto.js';
import { localCategoriaSchema } from '../dtos/local_categoria.dto.js';
import { controllerFor } from '../controllers/locales_categorias.controller.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
const categorias = controllerFor('lugar');
router.get('/', listar);
router.get('/buscar', buscar);
router.get('/:id/categorias', categorias.listar);
router.post('/:id/categorias', verifyToken, checkRole(['Administrador']), validate(localCategoriaSchema), categorias.crear);
router.delete('/:id/categorias/:idCategoria', verifyToken, checkRole(['Administrador']), categorias.eliminar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador']), validate(lugarSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateLugarSchema), actualizar);
export default router;
