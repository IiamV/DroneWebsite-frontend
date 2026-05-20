/**
 * Fixes model_url in the products table:
 * - Sets NULL for all products (clears wrong/stale URLs)
 * - Then sets the correct public Supabase URL for each file found in the bucket
 *
 * Usage:  npx tsx scripts/fix-model-urls.ts
 */

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Maps the GLB filename (without extension) back to a product slug.
// GLB naming convention: "Product_Name_With_Underscores.glb"
// We match by comparing the filename to each product's mock modelUrl path.
import { mockProducts } from '../src/mocks/products'

async function main() {
  console.log('🔧  Fixing model URLs...\n')

  // Step 1: Clear ALL model_url values — start fresh
  const { error: clearErr } = await sb.from('products').update({ model_url: null }).neq('id', '00000000-0000-0000-0000-000000000000')
  if (clearErr) { console.error('Failed to clear model_urls:', clearErr.message); process.exit(1) }
  console.log('✓  Cleared all model_url values\n')

  // Step 2: List files actually in the bucket
  const { data: files, error: listErr } = await sb.storage.from('product-models').list('', { limit: 200 })
  if (listErr) { console.error('Failed to list bucket:', listErr.message); process.exit(1) }
  if (!files?.length) { console.log('No files in product-models bucket.'); return }

  console.log(`Found ${files.length} file(s) in storage bucket:`)

  // Step 3: For each file, find the matching product by comparing the filename
  // to the mock modelUrl (e.g. "/models/products/DJI_F450_Flame_Wheel_Frame.glb")
  let updated = 0
  for (const file of files) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-models/${encodeURIComponent(file.name)}`

    // Find the product whose mock modelUrl ends with this filename
    const match = mockProducts.find((p) =>
      p.modelUrl && p.modelUrl.endsWith(`/${file.name}`)
    )

    if (!match) {
      console.log(`  ⚠  No product matched for: ${file.name}`)
      continue
    }

    // Update by slug (unique, not uuid)
    const { error: updateErr } = await sb
      .from('products')
      .update({ model_url: publicUrl })
      .eq('slug', match.slug)

    if (updateErr) {
      console.error(`  ✗  ${match.name}: ${updateErr.message}`)
    } else {
      console.log(`  ✓  ${match.name}`)
      console.log(`     ${publicUrl}`)
      updated++
    }
  }

  console.log(`\n✅  Done — ${updated} product(s) updated.`)
  console.log('\nCurrent state:')
  const { data } = await sb.from('products').select('slug, model_url').not('model_url', 'is', null)
  data?.forEach((p) => console.log(`  ${p.slug}: ${p.model_url}`))
}

main().catch((err) => { console.error('❌', err); process.exit(1) })
