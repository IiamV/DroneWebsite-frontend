'use client'

import { useRef, useEffect, Suspense, Component, useState, useCallback } from 'react'
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Box } from 'lucide-react'
import type { Product } from '@/types'

// ── Types ──────────────────────────────────────────────────────────────────
export interface PlacedProduct {
  product: Product
  position: [number, number, number]
}

type Axis = 'x' | 'y' | 'z'

const CATEGORY_SCALES: Record<Product['category'], number> = {
  frame:             0.6,
  motor:             0.2,
  esc:               0.25,
  flight_controller: 0.2,
  propeller:         0.3,
  battery:           0.35,
  camera:            0.15,
  complete_drone:    0.6,
}

const AXIS_COLORS: Record<Axis, string> = { x: '#ff3333', y: '#33ff33', z: '#3399ff' }
const AXIS_DIRS: Record<Axis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Returns true only for URLs the browser can actually fetch */
function isLoadableUrl(url: string | null): url is string {
  if (!url) return false
  // Local paths (e.g. /models/products/...) are only valid when the file
  // physically exists in /public. Supabase URLs are always absolute https://.
  // In production the only valid local model is served from /public — but
  // since we can't check the filesystem from the browser, we allow local
  // paths only when running on localhost (dev mode).
  if (url.startsWith('http')) return true
  // Allow local paths in dev (localhost) only
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return true
  return false
}

// ── Transform gizmo ────────────────────────────────────────────────────────
// All three arrows originate from the model center.
// Arrow length = largest model dimension * 0.8, so they're always proportional.
// Movement is clamped to ±MAX_WORLD units on all axes.
const MAX_WORLD = 50

function TransformGizmo({
  modelSize,
  onDragAxis,
  onDragStart,
  onDragEnd,
}: {
  modelSize: THREE.Vector3
  onDragAxis: (axis: Axis, delta: number) => void
  onDragStart: () => void
  onDragEnd: () => void
}) {
  const { camera, gl } = useThree()
  const dragging = useRef<{
    axis: Axis
    lastMouse: THREE.Vector2
  } | null>(null)

  // All three arrows use the same length = largest model dimension * 1.2
  // This makes them visually even regardless of the model's proportions
  const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z, 0.5)
  const arrowLen = maxDim * 1.2  // same for X, Y, Z
  const headLen = arrowLen * 0.1
  const headRad = headLen * 0.2

  const startDrag = useCallback((axis: Axis, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    dragging.current = {
      axis,
      lastMouse: new THREE.Vector2(e.clientX, e.clientY),
    }
    onDragStart()
    gl.domElement.style.cursor = 'grabbing'
  }, [gl, onDragStart])

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return
    const { axis, lastMouse } = dragging.current

    // Mouse delta since last frame
    const dx = e.clientX - lastMouse.x
    const dy = e.clientY - lastMouse.y
    lastMouse.set(e.clientX, e.clientY)

    // Project the axis direction into screen space to find the
    // screen-space unit vector for this axis at the current camera angle.
    // We use the camera's view-projection to get a pixel-per-world ratio.
    const origin = new THREE.Vector3(0, 0, 0).project(camera)
    const tip = AXIS_DIRS[axis].clone().project(camera)

    const rect = gl.domElement.getBoundingClientRect()
    // Screen-space vector for 1 world unit along this axis (in pixels)
    const sx = (tip.x - origin.x) * rect.width * 0.5
    const sy = -(tip.y - origin.y) * rect.height * 0.5

    const screenLen = Math.sqrt(sx * sx + sy * sy)
    if (screenLen < 0.5) return   // axis is pointing straight at camera, skip

    // How many world units does the mouse delta correspond to?
    // dot = pixels moved along the axis screen direction
    // worldDelta = dot / screenLen  (screenLen = pixels per world unit)
    const dot = (dx * sx + dy * sy) / screenLen
    const worldDelta = dot / screenLen

    onDragAxis(axis, worldDelta)
  }, [camera, gl, onDragAxis])

  const onPointerUp = useCallback((e: PointerEvent) => {
    if (!dragging.current) return
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    dragging.current = null
    gl.domElement.style.cursor = ''
    onDragEnd()
  }, [gl, onDragEnd])

  useEffect(() => {
    const el = gl.domElement
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl, onPointerMove, onPointerUp])

  const ArrowHandle = ({ axis }: { axis: Axis }) => {
    const dir = AXIS_DIRS[axis]
    const color = AXIS_COLORS[axis]
    const [hovered, setHovered] = useState(false)

    // All arrows start at origin (model center)
    const shaftEnd = dir.clone().multiplyScalar(arrowLen - headLen)
    const conePos = dir.clone().multiplyScalar(arrowLen - headLen * 0.5).toArray() as [number, number, number]
    const coneRot: [number, number, number] =
      axis === 'x' ? [0, 0, -Math.PI / 2] :
      axis === 'z' ? [Math.PI / 2, 0, 0] :
      [0, 0, 0]

    const c = hovered ? '#ffffff' : color

    return (
      <group>
        {/* Shaft */}
        <Line
          points={[[0, 0, 0], shaftEnd.toArray()]}
          color={c}
          lineWidth={hovered ? 3 : 2}
        />
        {/* Cone */}
        <mesh
          position={conePos}
          rotation={coneRot}
          onPointerDown={(e) => startDrag(axis, e)}
          onPointerEnter={() => { setHovered(true); gl.domElement.style.cursor = 'grab' }}
          onPointerLeave={() => { setHovered(false); if (!dragging.current) gl.domElement.style.cursor = '' }}
        >
          <coneGeometry args={[headRad, headLen, 8]} />
          <meshBasicMaterial color={c} />
        </mesh>
        {/* Fat invisible hit area */}
        <mesh
          position={dir.clone().multiplyScalar(arrowLen * 0.5).toArray() as [number, number, number]}
          rotation={coneRot}
          onPointerDown={(e) => startDrag(axis, e)}
          onPointerEnter={() => { setHovered(true); gl.domElement.style.cursor = 'grab' }}
          onPointerLeave={() => { setHovered(false); if (!dragging.current) gl.domElement.style.cursor = '' }}
          visible={false}
        >
          <cylinderGeometry args={[headRad * 2.5, headRad * 2.5, arrowLen, 6]} />
        </mesh>
      </group>
    )
  }

  // Small sphere at the origin where all axes meet
  return (
    <group>
      <mesh>
        <sphereGeometry args={[headRad * 0.8, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <ArrowHandle axis="x" />
      <ArrowHandle axis="y" />
      <ArrowHandle axis="z" />
    </group>
  )
}

// ── Single model ───────────────────────────────────────────────────────────
function PlacedModel({
  url,
  position,
  scale,
  selected,
  onSelect,
  onDragAxis,
  onDragStart,
  onDragEnd,
}: {
  url: string
  position: [number, number, number]
  scale: number
  selected: boolean
  onSelect: () => void
  onDragAxis: (axis: Axis, delta: number) => void
  onDragStart: () => void
  onDragEnd: () => void
}) {
  const { scene } = useGLTF(`${base}${url}`)
  const cloned = useRef<THREE.Group | null>(null)
  const [modelSize, setModelSize] = useState(new THREE.Vector3(1, 1, 1))

  if (!cloned.current) cloned.current = scene.clone(true)

  // Center and measure the model
  useEffect(() => {
    if (!cloned.current) return
    const box = new THREE.Box3().setFromObject(cloned.current)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)
    cloned.current.position.sub(center)
    // Store raw local-space size — the parent group's scale handles world sizing
    setModelSize(size.clone())
  }, [url, scale])

  // Highlight selected model with emissive tint
  useEffect(() => {
    if (!cloned.current) return
    cloned.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.emissive.set(selected ? '#1a3a6a' : '#000000')
          }
        })
      }
    })
  }, [selected])

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
    >
      <primitive object={cloned.current} />
      {/* Invisible click target so thin models are still clickable */}
      <mesh visible={false}>
        <boxGeometry args={[2, 2, 2]} />
      </mesh>

      {selected && (
        <TransformGizmo
          modelSize={modelSize}
          onDragAxis={onDragAxis}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      )}
    </group>
  )
}

// Per-model error boundary
interface ModelEBState { hasError: boolean }
class ModelErrorBoundary extends Component<{ children: React.ReactNode }, ModelEBState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({
  placedProducts,
  onUpdatePosition,
}: {
  placedProducts: PlacedProduct[]
  onUpdatePosition: (productId: string, newPos: [number, number, number]) => void
}) {
  const { camera, invalidate } = useThree()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [orbitEnabled, setOrbitEnabled] = useState(true)
  const livePos = useRef<Record<string, [number, number, number]>>({})
  const prevCount = useRef(0)

  // Sync live positions from props when products are added/removed
  useEffect(() => {
    placedProducts.forEach((pp) => {
      livePos.current[pp.product.id] = [...pp.position]
    })
    // Clean up removed products
    const ids = new Set(placedProducts.map((pp) => pp.product.id))
    Object.keys(livePos.current).forEach((id) => {
      if (!ids.has(id)) delete livePos.current[id]
    })
  }, [placedProducts])

  // Fit camera when a new product is placed
  useEffect(() => {
    if (placedProducts.length === 0 || placedProducts.length === prevCount.current) return
    prevCount.current = placedProducts.length
    const id = setTimeout(() => {
      const box = new THREE.Box3()
      placedProducts.forEach((pp) => box.expandByPoint(new THREE.Vector3(...pp.position)))
      if (box.isEmpty()) return
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)
      const maxDim = Math.max(size.x, size.y, size.z, 2)
      const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
      const dist = (maxDim / 2) / Math.tan(fov / 2) * 4.0
      camera.position.set(center.x + dist * 0.5, center.y + dist * 0.35, center.z + dist)
      camera.lookAt(center)
      camera.near = dist * 0.001
      camera.far = dist * 500
      camera.updateProjectionMatrix()
      invalidate()
    }, 100)
    return () => clearTimeout(id)
  }, [placedProducts, camera, invalidate])

  const handleDragAxis = useCallback((productId: string, axis: Axis, delta: number) => {
    const cur = livePos.current[productId] ?? [0, 0, 0]
    const next: [number, number, number] = [cur[0], cur[1], cur[2]]
    if (axis === 'x') next[0] = Math.max(-MAX_WORLD, Math.min(MAX_WORLD, cur[0] + delta))
    if (axis === 'y') next[1] = Math.max(-MAX_WORLD, Math.min(MAX_WORLD, cur[1] + delta))
    if (axis === 'z') next[2] = Math.max(-MAX_WORLD, Math.min(MAX_WORLD, cur[2] + delta))
    livePos.current[productId] = next
    onUpdatePosition(productId, next)
  }, [onUpdatePosition])

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 3]} intensity={1.2} />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} />
      <Environment preset="city" />

      {/* Deselect on background click */}
      <mesh
        visible={false}
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => setSelectedId(null)}
      >
        <planeGeometry args={[10000, 10000]} />
      </mesh>

      <Suspense fallback={null}>
        {placedProducts.map((pp) => pp.product.modelUrl && isLoadableUrl(pp.product.modelUrl) ? (
          <ModelErrorBoundary key={pp.product.id}>
            <PlacedModel
              url={pp.product.modelUrl}
              position={pp.position}
              scale={CATEGORY_SCALES[pp.product.category]}
              selected={selectedId === pp.product.id}
              onSelect={() => setSelectedId(pp.product.id)}
              onDragAxis={(axis, delta) => handleDragAxis(pp.product.id, axis, delta)}
              onDragStart={() => setOrbitEnabled(false)}
              onDragEnd={() => setOrbitEnabled(true)}
            />
          </ModelErrorBoundary>
        ) : null)}
      </Suspense>

      {/* enabled prop disables orbit while gizmo is being dragged */}
      <OrbitControls
        enabled={orbitEnabled}
        enableZoom
        enablePan
        enableRotate
        minDistance={0.1}
        maxDistance={10000}
        zoomSpeed={1.2}
      />
    </>
  )
}

// ── Error boundary ─────────────────────────────────────────────────────────
interface EBState { hasError: boolean; message?: string }
class CanvasErrorBoundary extends Component<{ children: React.ReactNode }, EBState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]">
          <Box size={48} aria-hidden="true" />
          <p className="text-sm">3D preview unavailable</p>
          {this.state.message && (
            <p className="text-xs opacity-50 max-w-xs text-center">{this.state.message}</p>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)] select-none">
      <Box size={56} strokeWidth={1} aria-hidden="true" />
      <p className="text-sm font-medium">Drag components here to build your drone</p>
      <p className="text-xs opacity-60">Only parts with a 3D badge can be placed</p>
    </div>
  )
}

// ── Public export ──────────────────────────────────────────────────────────
export interface AssemblyCanvasProps {
  placedProducts: PlacedProduct[]
  onUpdatePosition: (productId: string, newPos: [number, number, number]) => void
  onDrop: (productId: string, clientX: number, clientY: number) => void
}

export function AssemblyCanvas({ placedProducts, onUpdatePosition, onDrop }: AssemblyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const productId = e.dataTransfer.getData('productId')
    if (!productId) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    onDrop(productId, e.clientX - rect.left, e.clientY - rect.top)
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {placedProducts.length === 0 || placedProducts.every((p) => !isLoadableUrl(p.product.modelUrl)) ? (
        <EmptyState />
      ) : (
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0.5, 0.3, 1], fov: 50, near: 0.001, far: 100000 }}
            style={{ width: '100%', height: '100%' }}
            aria-label="3D assembly preview"
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: false,
            }}
            onCreated={({ gl }) => { gl.setClearColor('#111111', 1) }}
          >
            <Scene placedProducts={placedProducts} onUpdatePosition={onUpdatePosition} />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}
