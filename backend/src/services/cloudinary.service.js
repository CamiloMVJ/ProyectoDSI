import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../errors/app-error.js';

export function uploadWebp(buffer) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new AppError('Cloudinary no está configurado en el servidor', 503);
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'proyecto-dsi',
        format: 'webp',
        transformation: [{ quality: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(new AppError('No se pudo subir la imagen a Cloudinary', 502));
        }
        resolve(result);
      },
    );
    stream.on('error', () => reject(new AppError('No se pudo subir la imagen a Cloudinary', 502)));
    stream.end(buffer);
  });
}
