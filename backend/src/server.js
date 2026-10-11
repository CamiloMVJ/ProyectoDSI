import express from 'express';
import cors from 'cors';

import { categoriaSchema } from './dtos/categoria.dto.js'; //equis estoy probando algo no me hagan caso jsjsjs
import { validar } from './middlewares/validacion.middleware.js'; //equis x2

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando',
  });
});

app.post( //equis x3
  '/api/categorias',
  validar(categoriaSchema),
  (req, res) => {
      res.status(201).json({
          mensaje: 'Categoría validada correctamente',
          datos: req.body
      });
  }
);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});