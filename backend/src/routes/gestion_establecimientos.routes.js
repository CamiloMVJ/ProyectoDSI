import { Router } from 'express'
import { listar, guardar } from '../controllers/gestion_establecimientos.controller.js'
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { saveEstablishmentSchema } from '../dtos/gestion_establecimientos.dto.js'
import { crearDiaCerradoSchema } from '../dtos/dias_cerrados_locales.dto.js'
import { listar as listarDiasCerrados, crear as crearDiaCerrado, eliminar as eliminarDiaCerrado } from '../controllers/dias_cerrados_locales.controller.js'
import { listar as listarImagenes, eliminar as eliminarImagen } from '../controllers/local_images.controller.js'

const router = Router()
router.use(verifyToken, checkRole(['Administrador', 'Propietario', 'Usuario']))
router.get('/', listar)
router.get('/:id/imagenes', listarImagenes)
router.delete('/:id/imagenes/:imageId', eliminarImagen)
router.get('/:id/dias-cerrados', listarDiasCerrados)
router.post('/:id/dias-cerrados', validate(crearDiaCerradoSchema), crearDiaCerrado)
router.delete('/:id/dias-cerrados/:cierreId', eliminarDiaCerrado)
router.put('/:id', validate(saveEstablishmentSchema), guardar)
export default router
