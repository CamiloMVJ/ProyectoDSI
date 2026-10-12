import { Router } from 'express';
import categoriasRoutes from './categorias.routes.js';
import serviciosRoutes from './servicios.routes.js';

const router = Router();

router.use('/categorias', categoriasRoutes);
router.use('/servicios', serviciosRoutes);

export default router;