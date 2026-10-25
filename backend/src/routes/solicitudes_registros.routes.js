import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/solicitudes_registros.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { solicitudRegistroSchema } from '../dtos/solicitud_registro.dto.js';
import { updateSolicitudRegistroSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(solicitudRegistroSchema), crear);
router.patch('/:id', validate(updateSolicitudRegistroSchema), actualizar);
export default router;
