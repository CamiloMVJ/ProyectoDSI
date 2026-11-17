import { Router } from 'express'
import { listar, obtener, crear, actualizar, eliminar } from '../controllers/departamentos.controller.js'
import { departamentoSchema, updateDepartamentoSchema } from '../dtos/departamento.dto.js'
import { validate } from '../middlewares/validate.middleware.js'
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js'

const router = Router()
router.get('/', listar)
router.get('/:id', obtener)
router.post('/', verifyToken, checkRole(['Administrador']), validate(departamentoSchema), crear)
router.patch('/:id', verifyToken, checkRole(['Administrador']), validate(updateDepartamentoSchema), actualizar)
router.delete('/:id', verifyToken, checkRole(['Administrador']), eliminar)

export default router
