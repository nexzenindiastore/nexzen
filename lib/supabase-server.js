import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  )
}

export function createSupabaseServerClient() {
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()

  if (!url || !key) {
    throw new Error('Supabase server auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
}
