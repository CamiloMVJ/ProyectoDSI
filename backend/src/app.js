import express from "express"
import apiRoutes from "./routes/index.js"
import { notFound } from "./middlewares/notFound.middleware.js"
import { errorHandler } from "./middlewares/error.middleware.js"
import cors from 'cors'


const app = express()

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // Recomendado si usas cookies o JWT
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", apiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
