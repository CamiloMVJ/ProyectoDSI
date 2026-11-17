import { Router } from 'express'
import { listarTodos, listarPorLocal, crearAsociacion, eliminarAsociacion } from '../controllers/locales_categorias.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { asociacionCategoriaSchema } from '../dtos/local_categoria.dto.js'
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js'

const router = Router()
router.get('/', listarTodos)
router.get('/:idLocal', listarPorLocal)
router.post('/', verifyToken, checkRole(['Administrador']), validate(asociacionCategoriaSchema), crearAsociacion)
router.delete('/:idLocal/:idCategoria', verifyToken, checkRole(['Administrador']), eliminarAsociacion)
export default router
