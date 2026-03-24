'use client'

import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy-load the heavy Three.js canvas only when user requests it
const ProductCanvas = lazy(() => import('./ProductCanvas'))

interface Product3DViewerProps {
  modelUrl: string
  productName: string
}

export function Product3DViewer({ modelUrl, productName }: Product3DViewerProps) {
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
            <Loader2 size={32} className="animate-spin" aria-label="Loading 3D model" />
          </div>
        }
      >
        <ProductCanvas modelUrl={modelUrl} productName={productName} />
      </Suspense>
    </div>
  )
}
