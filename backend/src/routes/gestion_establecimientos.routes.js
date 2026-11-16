import { Router } from 'express'
import { listar, guardar } from '../controllers/gestion_establecimientos.controller.js'
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { saveEstablishmentSchema } from '../dtos/gestion_establecimientos.dto.js'

const router = Router()
router.use(verifyToken, checkRole(['Administrador', 'Propietario', 'Usuario']))
router.get('/', listar)
router.put('/:id', validate(saveEstablishmentSchema), guardar)
export default router
