// Archivo: src/routes/usuarios.routes.js
import { Router } from 'express';
import { listar, obtener, crear, actualizar, login } from '../controllers/usuarios.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { usuarioSchema } from '../dtos/usuario.dto.js';
import { updateUsuarioSchema } from '../dtos/update.dto.js';
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.get('/', verifyToken, checkRole(['Administrador']), listar);
router.get('/:id', verifyToken, obtener); 
router.post('/', validate(usuarioSchema), crear);
router.post('/login', login);
router.patch('/:id', verifyToken, validate(updateUsuarioSchema), actualizar);
export default router;