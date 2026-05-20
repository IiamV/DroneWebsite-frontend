import { HeroSection } from '@/components/features/home/HeroSection'
import { FeaturesSection } from '@/components/features/home/FeaturesSection'
import { CTASection } from '@/components/features/home/CTASection'
import { setRequestLocale } from 'next-intl/server'

// Fully static — no client JS on the homepage.
// HeroSection is a server component with a CSS-only drone animation.
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
