import { Router } from 'express';
import { listar, obtener, crear, actualizar } from '../controllers/pagos_publicidad.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { pagoSchema } from '../dtos/pago.dto.js';
import { updatePagoSchema } from '../dtos/update.dto.js';

const router = Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', validate(pagoSchema), crear);
router.patch('/:id', validate(updatePagoSchema), actualizar);
export default router;
