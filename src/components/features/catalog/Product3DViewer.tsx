'use client'

import { Component, Suspense, lazy } from 'react'
import { Loader2, Box } from 'lucide-react'

const ProductCanvas = lazy(() => import('./ProductCanvas'))

interface Product3DViewerProps {
  modelUrl: string
  productName: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ModelErrorBoundary extends Component<{ children: React.ReactNode; productName: string }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode; productName: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)]">
          <Box size={48} aria-hidden="true" />
          <p className="text-xs">{this.props.productName}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export function Product3DViewer({ modelUrl, productName }: Product3DViewerProps) {
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]">
      <ModelErrorBoundary productName={productName}>
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
              <Loader2 size={32} className="animate-spin" aria-label="Loading 3D model" />
            </div>
          }
        >
          <ProductCanvas modelUrl={modelUrl} productName={productName} />
        </Suspense>
      </ModelErrorBoundary>
    </div>
  )
}
