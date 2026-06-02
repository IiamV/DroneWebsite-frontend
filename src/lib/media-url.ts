const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function mediaUrl(src: string): string {
  if (!src) return src
  if (/^(https?:|data:|blob:)/.test(src)) return src
  return `${basePath}${src}`
}
