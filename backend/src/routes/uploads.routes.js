import { Router } from "express"
import { verifyToken } from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import {
  authorizeUploadSchema,
  confirmUploadSchema,
  fileIdSchema,
} from "../dtos/upload.dto.js"
import {
  authorize,
  confirm,
  signedDownload,
  remove,
} from "../controllers/uploads.controller.js"

const router = Router()
router.use(verifyToken)
router.post("/authorize", validate(authorizeUploadSchema, { stripUnknown: false }), authorize)
router.post("/confirm", validate(confirmUploadSchema, { stripUnknown: false }), confirm)
router.post("/signed-download", validate(fileIdSchema, { stripUnknown: false }), signedDownload)
router.delete("/", validate(fileIdSchema, { stripUnknown: false }), remove)
export default router
