import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/images.controller.js';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import { AppError } from '../errors/app-error.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new AppError('Solo se permiten imágenes JPG, PNG o WebP', 400));
    }
    callback(null, true);
  },
});

router.post('/', verifyToken, checkRole(['Administrador', 'Propietario']), upload.single('imagen'), uploadImage);
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return next(new AppError(error.code === 'LIMIT_FILE_SIZE'
      ? 'La imagen no puede superar 10 MB'
      : 'Solicitud de imagen inválida', status));
  }
  next(error);
});

export default router;
