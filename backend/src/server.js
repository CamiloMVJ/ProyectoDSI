import express from 'express'
import cors from 'cors'
import { findAll, update } from './repositories/locales_comerciales.repository.js'

const app = express()
const PORT = 3000

app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
}))


app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando',
  })
})



app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})