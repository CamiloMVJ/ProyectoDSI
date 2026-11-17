import { Router } from 'express'
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { savePlaceSchema } from '../dtos/gestion_lugares.dto.js'
import { listar, obtener, guardar, administradores } from '../controllers/gestion_lugares.controller.js'
import { listar as listarImagenes, eliminar as eliminarImagen } from '../controllers/local_images.controller.js'
import { listar as listarDiasCerrados, crear as crearDiaCerrado, eliminar as eliminarDiaCerrado } from '../controllers/dias_cerrados_locales.controller.js'
import { crearDiaCerradoSchema } from '../dtos/dias_cerrados_locales.dto.js'

const router = Router()
router.use(verifyToken, checkRole(['Administrador']))
router.get('/', listar)
router.get('/administradores', administradores)
router.get('/:id', obtener)
router.put('/:id', validate(savePlaceSchema), guardar)
router.get('/:id/imagenes', listarImagenes)
router.delete('/:id/imagenes/:imageId', eliminarImagen)
router.get('/:id/dias-cerrados', listarDiasCerrados)
router.post('/:id/dias-cerrados', validate(crearDiaCerradoSchema), crearDiaCerrado)
router.delete('/:id/dias-cerrados/:cierreId', eliminarDiaCerrado)
export default router
