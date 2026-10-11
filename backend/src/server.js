import express from 'express'
import cors from 'cors'
import servicesRoutes from './services/services.routes.js'


const app = express();
const PORT = 3000;
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando',
  })
})

app.use('/api', servicesRoutes)

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})