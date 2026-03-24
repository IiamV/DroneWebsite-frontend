'use client'

import { useEffect } from 'react'

// Updates <html lang="..."> on the client to match the active locale.
// Needed because the root layout owns <html> but doesn't know the locale.
export function LocaleHtmlUpdater({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
