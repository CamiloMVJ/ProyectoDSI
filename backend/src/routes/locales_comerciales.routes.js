// Archivo: src/routes/locales_comerciales.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/locales_comerciales.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { localComercialSchema } from '../dtos/local_comercial.dto.js';
import { updateLocalComercialSchema } from '../dtos/update.dto.js';
import { localCategoriaSchema } from '../dtos/local_categoria.dto.js';
import { controllerFor } from '../controllers/locales_categorias.controller.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
const categorias = controllerFor('comercial');
router.get('/', listar);
router.get('/:id/categorias', categorias.listar);
router.post('/:id/categorias', verifyToken, checkRole(['Administrador', 'Propietario']), validate(localCategoriaSchema), categorias.crear);
router.delete('/:id/categorias/:idCategoria', verifyToken, checkRole(['Administrador', 'Propietario']), categorias.eliminar);
router.get('/:id', obtener);
router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), validate(localComercialSchema), crear);
router.patch('/:id', verifyToken, checkRole(['Administrador', 'Propietario']), validate(updateLocalComercialSchema), actualizar);
export default router;
