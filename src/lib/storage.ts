/**
 * Helpers for building public URLs for assets stored in Supabase Storage.
 *
 * Bucket layout:
 *   product-images/   — product thumbnail and gallery images
 *   product-models/   — GLB 3D model files
 *   course-thumbnails/ — course cover images
 *   downloads/        — IDE installer files (private, signed URLs)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

function publicUrl(bucket: string, path: string): string {
  if (!path) return ''
  // If already an absolute URL (e.g. already a Supabase URL), return as-is
  if (path.startsWith('http')) return path
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

export function productImageUrl(path: string): string {
  return publicUrl('product-images', path)
}

export function productModelUrl(path: string): string {
  return publicUrl('product-models', path)
}

export function courseThumbnailUrl(path: string): string {
  return publicUrl('course-thumbnails', path)
}
