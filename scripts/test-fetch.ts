import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

async function main() {
  const { data, error } = await sb.from('products').select('slug, model_url').order('slug')
  if (error) { console.error('ERROR:', error); return }
  console.log(`Fetched ${data?.length} products`)
  data?.filter(p => p.model_url).forEach(p => console.log(' ', p.slug, '->', p.model_url))
}

main()
