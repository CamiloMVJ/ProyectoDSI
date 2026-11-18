import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import process from "node:process"

export default defineConfig({
  server: {
    proxy: {
      "/api": process.env.VITE_PROXY_TARGET || "http://localhost:3000",
    },
  },
  plugins: [react(), tailwindcss()],
})
