import { Router } from 'express';
import { listar, obtener, crear, actualizar, login } from '../controllers/usuarios.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { usuarioSchema } from '../dtos/usuario.dto.js';
import { updateUsuarioSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(usuarioSchema), crear);
router.post('/login', login);
router.patch('/:id', validate(updateUsuarioSchema), actualizar);
export default router;
