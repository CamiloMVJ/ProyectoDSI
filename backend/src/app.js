import express from 'express';
import apiRoutes from './routes/index.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares globales
app.use(express.json());

// Montaje de rutas de la API
app.use('/api', apiRoutes);

// Manejo de 404 (rutas que no existen)
app.use(notFound);

// Manejador global de errores (siempre al final)
app.use(errorHandler);

export default app;