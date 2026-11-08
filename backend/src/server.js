import express from 'express'
import cors from 'cors'
import app from './app.js';
import 'dotenv/config'


// const app = express();
const PORT = process.env.PORT || 3000;
// app.use(express.json())

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true // Recomendado si usas cookies o JWT
};

app.use(cors(corsOptions));

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando',
  })
})

app.listen(PORT, () => {
  console.log(`Servidor activo y escuchando en el puerto ${PORT}`)
})
