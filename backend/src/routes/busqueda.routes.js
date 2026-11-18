import { Router } from 'express'
import { search } from '../services/busqueda.service.js'

const router = Router()
router.get('/', async (req, res, next) => {
  try { res.json({ success: true, data: await search(req.query) }) }
  catch (error) { next(error) }
})

export default router
