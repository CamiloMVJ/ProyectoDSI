import "dotenv/config"
import app from "./app.js"
import { checkStorageStartup } from "./storage/config.js"
import { verifyStorageBuckets } from "./storage/verify-buckets.js"

checkStorageStartup()
if (process.env.SUPABASE_STORAGE_ENABLED === "true") await verifyStorageBuckets()

// const app = express();
const PORT = process.env.PORT || 3000
// app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend funcionando",
  })
})

app.listen(PORT, () => {
  console.log(`Servidor activo y escuchando en el puerto ${PORT}`)
})
