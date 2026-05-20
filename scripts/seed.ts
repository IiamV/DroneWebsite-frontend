/**
 * Seed script — populates Supabase with mock data and uploads local assets.
 *
 * Usage:  npx tsx scripts/seed.ts
 *
 * Requires .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

import { mockProducts } from '../src/mocks/products'
import { mockCourses } from '../src/mocks/courses'
import { mockDownloads } from '../src/mocks/downloads'
import { mockDocs } from '../src/mocks/docs'
import { mockTiers } from '../src/mocks/tiers'

// ── Load .env.local ───────────────────────────────────────────────────────────
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const key = line.slice(0, eq).trim()
      const val = line.slice(eq + 1).trim()
      if (key) process.env[key] = val
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Storage upload helper ─────────────────────────────────────────────────────
async function upload(bucket: string, storagePath: string, localPath: string, mime: string) {
  if (!existsSync(localPath)) {
    console.warn(`    ⚠  not found, skipping: ${localPath}`)
    return null
  }
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, readFileSync(localPath), { contentType: mime, upsert: true })
  if (error) { console.warn(`    ⚠  upload failed (${storagePath}): ${error.message}`); return null }
  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl
}

// ── Tiers — id is text PK, safe to pass directly ─────────────────────────────
async function seedTiers() {
  console.log('\n📦  Subscription tiers')
  for (const t of mockTiers) {
    const { error } = await supabase.from('subscription_tiers').upsert({
      id:               t.id,          // text PK — fine
      name:             t.name,
      price:            t.price,
      price_vnd:        t.priceVnd,
      billing_cycle:    t.billingCycle,
      features:         t.features,
      features_vi:      t.featuresVi,
      download_access:  t.downloadAccess,
      course_access:    t.courseAccess,
      simulator_access: t.simulatorAccess,
      badge_color:      t.badgeColor,
      badge_label:      t.badgeLabel,
      tier_rank:        t.tierRank,
    }, { onConflict: 'id' })
    console.log(error ? `  ✗ ${t.name}: ${error.message}` : `  ✓ ${t.name}`)
  }
}

// ── Products — omit id, conflict on slug ──────────────────────────────────────
async function seedProducts() {
  console.log('\n🛒  Products')
  for (const p of mockProducts) {
    const thumbLocal   = join(process.cwd(), 'public', p.thumbnailUrl)
    const thumbStorage = p.thumbnailUrl.replace(/^\/images\/products\//, '')
    const thumbUrl     = await upload('product-images', thumbStorage, thumbLocal, 'image/jpeg') ?? p.thumbnailUrl

    const imageUrls: string[] = []
    for (const img of p.imageUrls) {
      const url = await upload('product-images', img.replace(/^\/images\/products\//, ''), join(process.cwd(), 'public', img), 'image/jpeg')
      imageUrls.push(url ?? img)
    }

    let modelUrl: string | null = null
    if (p.modelUrl) {
      const modelStorage = p.modelUrl.replace(/^\/models\/products\//, '')
      const uploaded = await upload('product-models', modelStorage, join(process.cwd(), 'public', p.modelUrl), 'model/gltf-binary')
      // Only store the URL if the upload succeeded — null means "no 3D model"
      modelUrl = uploaded ?? null
    }

    const { error } = await supabase.from('products').upsert({
      // no id — let Postgres generate uuid
      slug:           p.slug,
      name:           p.name,
      brand:          p.brand,
      category:       p.category,
      thumbnail_url:  thumbUrl,
      image_urls:     imageUrls,
      short_summary:  p.shortSummary,
      description:    p.description,
      features:       p.features,
      specs:          p.specs,
      compatible_with: p.compatibleWith,
      tags:           p.tags,
      affiliate_url:  p.affiliateUrl,
      model_url:      modelUrl,
      created_at:     p.createdAt.toISOString(),
    }, { onConflict: 'slug' })

    console.log(error ? `  ✗ ${p.name}: ${error.message}` : `  ✓ ${p.name}${modelUrl ? ' (3D)' : ''}`)
  }
}

// ── Courses — omit id, conflict on slug ───────────────────────────────────────
async function seedCourses() {
  console.log('\n📚  Courses')
  for (const c of mockCourses) {
    const thumbStorage = c.thumbnailUrl.replace(/^\/images\/courses\//, '')
    const thumbUrl     = await upload('course-thumbnails', thumbStorage, join(process.cwd(), 'public', c.thumbnailUrl), 'image/jpeg') ?? c.thumbnailUrl

    const { data: courseRow, error: courseErr } = await supabase
      .from('courses')
      .upsert({
        // no id
        slug:             c.slug,
        title:            c.title,
        description:      c.description,
        thumbnail_url:    thumbUrl,
        category:         c.category,
        difficulty:       c.difficulty,
        duration_minutes: c.durationMinutes,
        required_tier:    c.requiredTier,
        created_at:       c.createdAt.toISOString(),
      }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (courseErr || !courseRow) {
      console.error(`  ✗ ${c.title}: ${courseErr?.message}`)
      continue
    }

    // Delete existing modules then re-insert (avoids duplicate order conflicts)
    await supabase.from('course_modules').delete().eq('course_id', courseRow.id)

    for (const m of c.modules) {
      const { error: modErr } = await supabase.from('course_modules').insert({
        // no id
        course_id: courseRow.id,
        title:     m.title,
        video_url: m.videoUrl,
        content:   m.content,
        order:     m.order,
      })
      if (modErr) console.error(`    ✗ ${m.title}: ${modErr.message}`)
    }

    console.log(`  ✓ ${c.title} (${c.modules.length} modules)`)
  }
}

// ── Downloads — omit id, conflict on storage_path ────────────────────────────
async function seedDownloads() {
  console.log('\n⬇  Downloads')
  for (const d of mockDownloads) {
    const { error } = await supabase.from('downloads').upsert({
      // no id
      title:         d.title,
      description:   d.description,
      version:       d.version,
      platform:      d.platform,
      file_size:     d.fileSize,
      storage_path:  d.storagePath,
      required_tier: d.requiredTier,
      release_date:  d.releaseDate.toISOString().split('T')[0],
      changelog:     d.changelog,
    }, { onConflict: 'storage_path' })
    console.log(error ? `  ✗ ${d.title} (${d.platform}): ${error.message}` : `  ✓ ${d.title} (${d.platform})`)
  }
}

// ── Docs — omit id, conflict on slug (array column) ──────────────────────────
async function seedDocs() {
  console.log('\n📄  Docs')
  for (const d of mockDocs) {
    const { error } = await supabase.from('doc_pages').upsert({
      // no id
      slug:        d.slug,
      title:       d.title,
      content:     d.content,
      order:       d.order,
      parent_slug: d.parentSlug,
      updated_at:  d.updatedAt.toISOString(),
    }, { onConflict: 'slug' })
    console.log(error ? `  ✗ ${d.title}: ${error.message}` : `  ✓ ${d.title}`)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`🚀  Seeding → ${SUPABASE_URL}`)
  await seedTiers()
  await seedProducts()
  await seedCourses()
  await seedDownloads()
  await seedDocs()
  console.log('\n✅  Done!')
}

main().catch((err) => { console.error('\n❌  Seed failed:', err); process.exit(1) })
