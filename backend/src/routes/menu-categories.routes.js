import { Router } from 'express'
import { findAll } from '../repositories/menu-categories.repository.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: await findAll() })
  } catch (error) {
    next(error)
  }
})

export default router
