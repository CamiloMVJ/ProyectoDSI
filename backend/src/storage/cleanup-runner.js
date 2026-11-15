import "dotenv/config"
import { cleanupPending } from "./cleanup.js"
import { AppError } from "../errors/app-error.js"

try {
  const result = await cleanupPending({
    dryRun: process.env.SUPABASE_CLEANUP_APPLY !== "true",
  })
  console.info(
    `Limpieza Storage: simulación=${result.dryRun}, candidatos=${result.candidates}, eliminados=${result.deleted}`,
  )
} catch (error) {
  console.error(
    `Limpieza Storage: ${error instanceof AppError ? error.message : "Error inesperado"}`,
  )
  process.exitCode = 1
}
