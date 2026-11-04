import { Router } from "express";
import {
  listar,
  obtener,
  crear,
  actualizar,
} from "../controllers/administradores.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { administradorSchema } from "../dtos/administradores.dto.js";
import { updateAdministradorSchema } from "../dtos/update.dto.js";
import { verifyToken, checkRole} from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", verifyToken, checkRole(['Administrador']), listar);
router.get("/:id", verifyToken, checkRole(['Administrador']), obtener);
router.post("/", verifyToken, checkRole(['Administrador']), validate(administradorSchema), crear);
router.patch("/:id", verifyToken, checkRole(['Administrador']), validate(updateAdministradorSchema), actualizar);
export default router;
