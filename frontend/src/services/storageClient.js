import { createClient } from "@supabase/supabase-js"

let client

export function getPublicStorageClient() {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key || !/^https:\/\/.+\.supabase\.co\/?$/.test(url)) {
    throw new Error("La configuración pública de Storage está incompleta.")
  }
  client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
  return client
}
