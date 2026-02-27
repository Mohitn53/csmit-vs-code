import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Wrap fetch with an 8-second timeout so network failures fail fast
// instead of hanging for the full TCP timeout (30+ seconds)
const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(new Error('Request timeout')), 8000)
  
  // If the incoming init already has a signal, we need to handle it
  if (init?.signal) {
    init.signal.addEventListener('abort', () => {
      controller.abort(init.signal.reason)
    })
  }
  
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(id)
  )
}

// Singleton — prevent "Multiple GoTrueClient instances" warning from HMR
const KEY = '__supabase_singleton__'
const g = globalThis as typeof globalThis & { [KEY]?: SupabaseClient }

if (!g[KEY]) {
  g[KEY] = createClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: fetchWithTimeout },
  })
}

export const supabase = g[KEY]!
