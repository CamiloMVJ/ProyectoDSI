// Archivo: src/routes/resenas.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar, listarPublicasDelLocal, permisosDelLocal, responder } from '../controllers/resenas.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { publicarResenaSchema, responderResenaSchema } from '../dtos/resena.dto.js';
import { updateResenaSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador']), listar);
router.get('/local/:idLocal', listarPublicasDelLocal);
router.get('/local/:idLocal/permisos', verifyToken, checkRole(['Propietario']), permisosDelLocal);
router.get('/:id', verifyToken, checkRole(['Administrador']), obtener);
router.post('/', verifyToken, checkRole(['Usuario', 'Propietario']), validate(publicarResenaSchema, { stripUnknown: false }), crear);
router.patch('/:id/respuesta', verifyToken, checkRole(['Propietario']), validate(responderResenaSchema, { stripUnknown: false }), responder);
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateResenaSchema), actualizar);
export default router;
