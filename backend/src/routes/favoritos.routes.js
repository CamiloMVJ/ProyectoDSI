import { Router } from 'express'
import { listar, crear, eliminar } from '../controllers/favoritos.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { favoritoSchema } from '../dtos/favorito.dto.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()
router.use(verifyToken)
router.get('/', listar)
router.post('/', validate(favoritoSchema), crear)
router.delete('/:id', eliminar)
export default router
