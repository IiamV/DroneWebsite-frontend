import { createClient } from '@/lib/supabase/server'
import { toAppError } from '@/lib/fetch-utils'
import type { Download } from '@/types'

function rowToDownload(row: Record<string, unknown>): Download {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    version: row.version as string,
    platform: row.platform as Download['platform'],
    fileSize: row.file_size as string,
    storagePath: row.storage_path as string,
    requiredTier: row.required_tier as string,
    releaseDate: new Date(row.release_date as string),
    changelog: row.changelog as string,
  }
}

export async function getDownloads(): Promise<Download[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .order('release_date', { ascending: false })

    if (error) throw new Error(error.message)
    return (data ?? []).map(rowToDownload)
  } catch (err) {
    throw toAppError(err)
  }
}

/**
 * Returns a short-lived signed URL for a download file stored in the
 * `downloads` bucket. Expires in 60 seconds.
 */
export async function getDownloadSignedUrl(storagePath: string): Promise<string> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.storage
      .from('downloads')
      .createSignedUrl(storagePath, 60)

    if (error || !data?.signedUrl) throw new Error(error?.message ?? 'Failed to create signed URL')
    return data.signedUrl
  } catch (err) {
    throw toAppError(err)
  }
}
