import { AppError } from '../errors/app-error.js';
import { uploadWebp } from '../services/cloudinary.service.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Debés enviar una imagen en el campo imagen', 400);

    const result = await uploadWebp(req.file.buffer);
    res.status(201).json({
      success: true,
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
};
