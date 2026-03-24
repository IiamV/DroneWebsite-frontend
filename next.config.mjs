/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoName = 'DroneWebsite-frontend'

const nextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : '',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  async redirects() {
    return []
  },
}

// For static export (GitHub Pages): skip the next-intl server plugin entirely.
// NextIntlClientProvider in [locale]/layout.tsx handles translations client-side.
// For local dev / server builds: apply the plugin for full server-side i18n support.
let finalConfig = nextConfig

if (!isGithubPages) {
  const { default: createNextIntlPlugin } = await import('next-intl/plugin')
  finalConfig = createNextIntlPlugin('./src/i18n/request.ts')(nextConfig)
}

export default finalConfig
