import express from 'express'
import cors from 'cors'
import app from './app.js';
import 'dotenv/config'


// const app = express();
const PORT = process.env.PORT || 3000;
// app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando',
  })
})

app.listen(PORT, () => {
  console.log(`Servidor activo y escuchando en el puerto ${PORT}`)
})
