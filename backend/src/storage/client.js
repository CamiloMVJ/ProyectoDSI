import { createClient } from '@supabase/supabase-js'
import { storageConfig } from './config.js'

let singleton
let singletonUrl

export function getStorageClient(config = storageConfig()) {
  if (!singleton || singletonUrl !== config.url) {
    singleton = createClient(config.url, config.secretKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
    singletonUrl = config.url
  }
  return singleton
}
