import express from 'express'
import cors from 'cors'
import app from './app.js';
import 'dotenv/config'


// const app = express();
const PORT = process.env.PORT || 3000;
// app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando',
  })
})

// app.use('/api', servicesRoutes)

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})
