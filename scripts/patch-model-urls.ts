/**
 * Patches model_url for products whose GLB is already in Supabase storage
 * but the DB row has null (e.g. because the file wasn't local when seed ran).
 *
 * Usage:  npx tsx scripts/patch-model-urls.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load .env.local
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  console.log('🔍  Checking product-models bucket...\n')

  // List all files in the product-models bucket
  const { data: files, error } = await supabase.storage.from('product-models').list('', { limit: 200 })
  if (error) { console.error('Failed to list bucket:', error.message); process.exit(1) }
  if (!files?.length) { console.log('No files found in product-models bucket.'); return }

  console.log(`Found ${files.length} file(s) in storage:`)
  for (const f of files) console.log(`  • ${f.name}`)

  // For each file, build the public URL and update the matching product
  let updated = 0
  for (const file of files) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-models/${file.name}`

    // Match by the filename pattern: "Product_Name.glb" → find product whose
    // modelUrl path ends with this filename
    const { data: products } = await supabase
      .from('products')
      .select('id, slug, name, model_url')
      .or(`model_url.is.null,model_url.like.%${file.name}`)

    if (!products?.length) {
      console.log(`\n  ⚠  No product matched for: ${file.name}`)
      continue
    }

    for (const product of products) {
      if (product.model_url === publicUrl) {
        console.log(`\n  ✓ Already correct: ${product.name}`)
        continue
      }
      const { error: updateErr } = await supabase
        .from('products')
        .update({ model_url: publicUrl })
        .eq('id', product.id)

      if (updateErr) {
        console.error(`\n  ✗ Failed to update ${product.name}: ${updateErr.message}`)
      } else {
        console.log(`\n  ✓ Updated: ${product.name}\n    ${publicUrl}`)
        updated++
      }
    }
  }

  console.log(`\n✅  Done — ${updated} product(s) updated.`)
}

main().catch((err) => { console.error('❌', err); process.exit(1) })
