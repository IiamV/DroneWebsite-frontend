'use client'

import { useRef, useEffect, useLayoutEffect, Suspense, Component, useState, useCallback, createContext, useContext, type MutableRefObject } from 'react'
import { Canvas, useThree, ThreeEvent, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Line } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { Box } from 'lucide-react'
import type { Product } from '@/types'
import type { Wire } from '@/lib/wiring'

// ── Public types ───────────────────────────────────────────────────────────
export interface PlacedProduct {
  instanceId: string
  product: Product
  position: [number, number, number]
}

type Axis = 'x' | 'y' | 'z'

const CATEGORY_SCALES: Record<Product['category'], number> = {
  frame: 0.6, motor: 0.2, esc: 0.25, flight_controller: 0.2,
  propeller: 0.3, battery: 0.35, camera: 0.15, complete_drone: 0.6,
}

const AXIS_COLORS: Record<Axis, string> = { x: '#ff3333', y: '#33ff33', z: '#3399ff' }
const AXIS_DIRS: Record<Axis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const MAX_WORLD = 50

type LivePositionsRef = MutableRefObject<Record<string, [number, number, number]>>
const LivePositionsContext = createContext<LivePositionsRef | null>(null)

function useLivePositions(): LivePositionsRef {
  const ctx = useContext(LivePositionsContext)
  if (!ctx) throw new Error('useLivePositions must be used inside Scene')
  return ctx
}

function isLoadableUrl(url: string | null): url is string {
  if (!url) return false
  if (url.startsWith('http')) return true
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return true
  return false
}

// ── Transform gizmo ────────────────────────────────────────────────────────
function TransformGizmo({ modelSize, onDragAxis, onDragStart, onDragEnd }: {
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

  const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z, 0.5)
  const arrowLen = maxDim * 1.2
  const headLen = arrowLen * 0.1
  const headRad = headLen * 0.2

  const startDrag = useCallback((axis: Axis, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    dragging.current = { axis, lastMouse: new THREE.Vector2(e.clientX, e.clientY) }
    onDragStart()
    gl.domElement.style.cursor = 'grabbing'
  }, [gl, onDragStart])

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return
    const { axis, lastMouse } = dragging.current
    const dx = e.clientX - lastMouse.x
    const dy = e.clientY - lastMouse.y
    lastMouse.set(e.clientX, e.clientY)

    const origin = new THREE.Vector3(0, 0, 0).project(camera)
    const tip = AXIS_DIRS[axis].clone().project(camera)
    const rect = gl.domElement.getBoundingClientRect()
    const sx = (tip.x - origin.x) * rect.width * 0.5
    const sy = -(tip.y - origin.y) * rect.height * 0.5
    const screenLen = Math.sqrt(sx * sx + sy * sy)
    if (screenLen < 0.5) return

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
    const shaftEnd = dir.clone().multiplyScalar(arrowLen - headLen)
    const conePos = dir.clone().multiplyScalar(arrowLen - headLen * 0.5).toArray() as [number, number, number]
    const coneRot: [number, number, number] = axis === 'x' ? [0, 0, -Math.PI / 2] : axis === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, 0]
    const c = hovered ? '#ffffff' : color
    return (
      <group>
        <Line points={[[0, 0, 0], shaftEnd.toArray()]} color={c} lineWidth={hovered ? 3 : 2} />
        <mesh position={conePos} rotation={coneRot}
          onPointerDown={(e) => startDrag(axis, e)}
          onPointerEnter={() => { setHovered(true); gl.domElement.style.cursor = 'grab' }}
          onPointerLeave={() => { setHovered(false); if (!dragging.current) gl.domElement.style.cursor = '' }}>
          <coneGeometry args={[headRad, headLen, 8]} />
          <meshBasicMaterial color={c} />
        </mesh>
        <mesh position={dir.clone().multiplyScalar(arrowLen * 0.5).toArray() as [number, number, number]}
          rotation={coneRot} visible={false}
          onPointerDown={(e) => startDrag(axis, e)}
          onPointerEnter={() => { setHovered(true); gl.domElement.style.cursor = 'grab' }}
          onPointerLeave={() => { setHovered(false); if (!dragging.current) gl.domElement.style.cursor = '' }}>
          <cylinderGeometry args={[headRad * 2.5, headRad * 2.5, arrowLen, 6]} />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      <mesh><sphereGeometry args={[headRad * 0.8, 8, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <ArrowHandle axis="x" /><ArrowHandle axis="y" /><ArrowHandle axis="z" />
    </group>
  )
}

function ConnectorIcon({ instanceId, isWiring, isPendingTarget, onConnectorClick }: {
  instanceId: string
  isWiring: boolean
  isPendingTarget: boolean
  onConnectorClick: (instanceId: string, worldPos: THREE.Vector3) => void
}) {
  const { gl } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Pulse when this is the active wire source
  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.scale.setScalar(isWiring ? 1 + Math.sin(Date.now() * 0.005) * 0.35 : 1)
  })

  const color = isWiring ? '#facc15' : isPendingTarget ? '#4ade80' : hovered ? '#facc15' : '#e2e8f0'

  return (
    // position [0,0,0] = center of the model group (bounding box already centered)
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      renderOrder={999}
      onPointerDown={(e) => {
        e.stopPropagation()
        const wp = new THREE.Vector3()
        meshRef.current?.getWorldPosition(wp)
        onConnectorClick(instanceId, wp)
      }}
      onPointerEnter={() => { setHovered(true); gl.domElement.style.cursor = 'crosshair' }}
      onPointerLeave={() => { setHovered(false); gl.domElement.style.cursor = '' }}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} depthTest={false} />
    </mesh>
  )
}

// ── Wire line between two world positions ──────────────────────────────────
function WireLine({ posA, posB, color, onClick }: {
  posA: [number, number, number]
  posB: [number, number, number]
  color: string
  onClick: (midX: number, midY: number) => void
}) {
  const { camera, gl } = useThree()
  const [hovered, setHovered] = useState(false)
  const mid = new THREE.Vector3(
    (posA[0] + posB[0]) / 2,
    (posA[1] + posB[1]) / 2,
    (posA[2] + posB[2]) / 2,
  )

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const p = mid.clone().project(camera)
    const rect = gl.domElement.getBoundingClientRect()
    onClick(((p.x + 1) / 2) * rect.width + rect.left, ((-p.y + 1) / 2) * rect.height + rect.top)
  }, [camera, gl, mid, onClick])

  // Don't render zero-length wires (both endpoints at origin = not yet positioned)
  const dist = new THREE.Vector3(...posA).distanceTo(new THREE.Vector3(...posB))
  if (dist < 0.001) return null

  return (
    <group>
      <Line
        points={[posA, posB]}
        color={hovered ? '#ffffff' : color}
        lineWidth={hovered ? 4 : 2.5}
        renderOrder={998}
      />
      {/* Clickable sphere at midpoint */}
      <mesh position={mid.toArray() as [number, number, number]} visible={false}
        onClick={handleClick}
        onPointerEnter={() => { setHovered(true); gl.domElement.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); gl.domElement.style.cursor = '' }}>
        <sphereGeometry args={[0.2, 6, 6]} />
      </mesh>
    </group>
  )
}

// ── Pending wire follows cursor ────────────────────────────────────────────
function PendingWire({ fromPos }: { fromPos: [number, number, number] }) {
  const { camera, gl } = useThree()
  const [cursorPos, setCursorPos] = useState<[number, number, number]>(fromPos)

  useEffect(() => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const raycaster = new THREE.Raycaster()
    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(ndc, camera)
      const hit = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, hit)) setCursorPos([hit.x, fromPos[1], hit.z])
    }
    gl.domElement.addEventListener('pointermove', onMove)
    return () => gl.domElement.removeEventListener('pointermove', onMove)
  }, [camera, gl, fromPos])

  return <Line points={[fromPos, cursorPos]} color="#facc15" lineWidth={2} dashed dashSize={0.15} gapSize={0.08} renderOrder={998} />
}

// ── Single placed model ────────────────────────────────────────────────────
function PlacedModel({
  url, instanceId, product, position, scale, selected, wiringMode,
  isWiringSource, isPendingWireTarget,
  onSelect, onDragAxis, onDragStart, onDragEnd, onConnectorClick,
}: {
  url: string
  instanceId: string
  product: Product
  position: [number, number, number]
  scale: number
  selected: boolean
  wiringMode: boolean
  isWiringSource: boolean
  isPendingWireTarget: boolean
  onSelect: () => void
  onDragAxis: (axis: Axis, delta: number) => void
  onDragStart: () => void
  onDragEnd: () => void
  onConnectorClick: (instanceId: string, worldPos: THREE.Vector3) => void
}) {
  const { scene } = useGLTF(`${base}${url}`)
  const cloned = useRef<THREE.Group | null>(null)
  const rootRef = useRef<THREE.Group>(null)
  const livePositions = useLivePositions()
  const [modelSize, setModelSize] = useState(new THREE.Vector3(1, 1, 1))

  if (!cloned.current) cloned.current = scene.clone(true)

  useEffect(() => {
    if (!cloned.current) return
    const box = new THREE.Box3().setFromObject(cloned.current)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)
    cloned.current.position.sub(center)
    setModelSize(size.clone())
  }, [url, scale])

  const applyPosition = useCallback((pos: [number, number, number]) => {
    livePositions.current[instanceId] = pos
    if (rootRef.current) rootRef.current.position.set(pos[0], pos[1], pos[2])
  }, [instanceId, livePositions])

  useLayoutEffect(() => {
    applyPosition([...position])
  }, [instanceId, position, applyPosition])

  // Imperative position only — do NOT pass `position={}` on <group> or R3F resets it every frame from props.
  useFrame(() => {
    const live = livePositions.current[instanceId]
    if (live && rootRef.current) {
      rootRef.current.position.set(live[0], live[1], live[2])
    }
  })

  useEffect(() => {
    if (!cloned.current) return
    cloned.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial)
            m.emissive.set(selected ? '#1a3a6a' : isWiringSource ? '#3a2a00' : '#000000')
        })
      }
    })
  }, [selected, isWiringSource])

  return (
    <group ref={rootRef} scale={[scale, scale, scale]}
      onClick={(e) => { e.stopPropagation(); onSelect() }}>
      <primitive object={cloned.current} />
      {/* Invisible click target */}
      <mesh visible={false}><boxGeometry args={[2, 2, 2]} /></mesh>

      {/* Connector — only visible in wire mode, centered on model */}
      {wiringMode && (
        <ConnectorIcon
          instanceId={instanceId}
          isWiring={isWiringSource}
          isPendingTarget={isPendingWireTarget}
          onConnectorClick={onConnectorClick}
        />
      )}

      {selected && !wiringMode && (
        <TransformGizmo modelSize={modelSize}
          onDragAxis={onDragAxis} onDragStart={onDragStart} onDragEnd={onDragEnd} />
      )}
    </group>
  )
}

// Per-model error boundary
interface ModelEBState { hasError: boolean }
class ModelErrorBoundary extends Component<{ children: React.ReactNode }, ModelEBState> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({
  placedProducts, wires, pendingWireSourceId, wiringMode,
  onUpdatePosition, onConnectorClick, onWireClick, onDeleteInstance,
}: {
  placedProducts: PlacedProduct[]
  wires: Wire[]
  pendingWireSourceId: string | null
  wiringMode: boolean
  onUpdatePosition: (instanceId: string, newPos: [number, number, number]) => void
  onConnectorClick: (instanceId: string, worldPos: THREE.Vector3) => void
  onWireClick: (wireId: string, screenX: number, screenY: number) => void
  onDeleteInstance: (instanceId: string) => void
}) {
  const { camera, invalidate } = useThree()
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null)
  const [orbitEnabled, setOrbitEnabled] = useState(true)
  const orbitRef = useRef<OrbitControlsImpl | null>(null)
  const orbitSnapshot = useRef<{
    enabled: boolean
    enableRotate: boolean
    enablePan: boolean
    enableZoom: boolean
  } | null>(null)
  const livePositions = useRef<Record<string, [number, number, number]>>({})
  const draggingId = useRef<string | null>(null)
  const dragState = useRef<{
    instanceId: string
    startPos: [number, number, number]
    scale: number
  } | null>(null)
  const prevCount = useRef(0)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedInstanceId) {
        onDeleteInstance(selectedInstanceId)
        setSelectedInstanceId(null)
      }
      if (e.key === 'Escape') setSelectedInstanceId(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedInstanceId, onDeleteInstance])

  // Sync live positions from props (skip instance currently being dragged)
  useEffect(() => {
    placedProducts.forEach((pp) => {
      if (draggingId.current !== pp.instanceId) {
        livePositions.current[pp.instanceId] = [...pp.position]
      }
    })
    const ids = new Set(placedProducts.map((pp) => pp.instanceId))
    Object.keys(livePositions.current).forEach((id) => {
      if (!ids.has(id)) delete livePositions.current[id]
    })
  }, [placedProducts])

  // Fit camera when new products are placed
  useEffect(() => {
    if (placedProducts.length === 0 || placedProducts.length === prevCount.current) return
    prevCount.current = placedProducts.length
    const tid = setTimeout(() => {
      const box = new THREE.Box3()
      placedProducts.forEach((pp) => box.expandByPoint(new THREE.Vector3(...pp.position)))
      if (box.isEmpty()) return
      const size = new THREE.Vector3(); const center = new THREE.Vector3()
      box.getSize(size); box.getCenter(center)
      const maxDim = Math.max(size.x, size.y, size.z, 2)
      const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
      const dist = (maxDim / 2) / Math.tan(fov / 2) * 4.0
      camera.position.set(center.x + dist * 0.5, center.y + dist * 0.35, center.z + dist)
      camera.lookAt(center)
      camera.near = dist * 0.001; camera.far = dist * 500
      camera.updateProjectionMatrix(); invalidate()
    }, 100)
    return () => clearTimeout(tid)
  }, [placedProducts, camera, invalidate])

  const lockOrbit = useCallback(() => {
    const controls = orbitRef.current
    if (controls) {
      orbitSnapshot.current = {
        enabled: controls.enabled,
        enableRotate: controls.enableRotate,
        enablePan: controls.enablePan,
        enableZoom: controls.enableZoom,
      }
      controls.enabled = false
      controls.enableRotate = false
      controls.enablePan = false
      controls.enableZoom = false
    }
    setOrbitEnabled(false)
  }, [])

  const unlockOrbit = useCallback(() => {
    const controls = orbitRef.current
    const snap = orbitSnapshot.current
    if (controls && snap) {
      controls.enableRotate = snap.enableRotate
      controls.enablePan = snap.enablePan
      controls.enableZoom = snap.enableZoom
      controls.enabled = snap.enabled
    }
    orbitSnapshot.current = null
    setOrbitEnabled(true)
  }, [])

  const handleDragStart = useCallback((instanceId: string, modelScale: number) => {
    lockOrbit()
    draggingId.current = instanceId
    const startPos = livePositions.current[instanceId] ?? [0, 0, 0]
    dragState.current = { instanceId, startPos: [...startPos], scale: modelScale }
  }, [lockOrbit])

  const handleDragAxis = useCallback((instanceId: string, axis: Axis, delta: number) => {
    const cur = livePositions.current[instanceId] ?? [0, 0, 0]
    const next: [number, number, number] = [cur[0], cur[1], cur[2]]
    const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
    next[idx] = Math.max(-MAX_WORLD, Math.min(MAX_WORLD, cur[idx] + delta))
    livePositions.current[instanceId] = next
    invalidate()
  }, [invalidate])

  const handleDragEnd = useCallback((instanceId: string) => {
    const pos = livePositions.current[instanceId]
    if (pos) onUpdatePosition(instanceId, pos)
    draggingId.current = null
    dragState.current = null
    unlockOrbit()
  }, [onUpdatePosition, unlockOrbit])

  const getPos = useCallback((instanceId: string): [number, number, number] => {
    if (livePositions.current[instanceId]) return livePositions.current[instanceId]
    return placedProducts.find((pp) => pp.instanceId === instanceId)?.position ?? [0, 0, 0]
  }, [placedProducts])

  const pendingSourcePos = pendingWireSourceId ? getPos(pendingWireSourceId) : null

  return (
    <LivePositionsContext.Provider value={livePositions}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 3]} intensity={1.2} />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} />
      <Environment preset="city" />

      {/* Background click — deselect */}
      <mesh visible={false} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => setSelectedInstanceId(null)}>
        <planeGeometry args={[10000, 10000]} />
      </mesh>

      {/* Wires — only in wire mode */}
      {wiringMode && wires.map((wire) => {
        const posA = getPos(wire.productIdA)
        const posB = getPos(wire.productIdB)
        return (
          <WireLine key={wire.id} posA={posA} posB={posB}
            color={wire.connectionType.color}
            onClick={(sx, sy) => onWireClick(wire.id, sx, sy)} />
        )
      })}

      {/* Pending wire */}
      {wiringMode && pendingWireSourceId && pendingSourcePos && (
        <PendingWire fromPos={pendingSourcePos} />
      )}

      <Suspense fallback={null}>
        {placedProducts.map((pp) => {
          if (!pp.product.modelUrl || !isLoadableUrl(pp.product.modelUrl)) return null
          return (
            <ModelErrorBoundary key={pp.instanceId}>
              <PlacedModel
                url={pp.product.modelUrl}
                instanceId={pp.instanceId}
                product={pp.product}
                position={pp.position}
                scale={CATEGORY_SCALES[pp.product.category]}
                selected={selectedInstanceId === pp.instanceId}
                wiringMode={wiringMode}
                isWiringSource={pendingWireSourceId === pp.instanceId}
                isPendingWireTarget={pendingWireSourceId !== null && pendingWireSourceId !== pp.instanceId}
                onSelect={() => setSelectedInstanceId(pp.instanceId)}
                onDragAxis={(axis, delta) => handleDragAxis(pp.instanceId, axis, delta)}
                onDragStart={() => handleDragStart(pp.instanceId, CATEGORY_SCALES[pp.product.category])}
                onDragEnd={() => handleDragEnd(pp.instanceId)}
                onConnectorClick={onConnectorClick}
              />
            </ModelErrorBoundary>
          )
        })}
      </Suspense>

      <OrbitControls
        ref={orbitRef}
        enabled={orbitEnabled && !pendingWireSourceId}
        enableZoom enablePan enableRotate
        minDistance={0.1} maxDistance={10000} zoomSpeed={1.2}
      />
    </LivePositionsContext.Provider>
  )
}

// ── Error boundary ─────────────────────────────────────────────────────────
interface EBState { hasError: boolean; message?: string }
class CanvasErrorBoundary extends Component<{ children: React.ReactNode }, EBState> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError(error: Error) { return { hasError: true, message: error.message } }
  render() {
    if (this.state.hasError) return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]">
        <Box size={48} aria-hidden="true" />
        <p className="text-sm">3D preview unavailable</p>
        {this.state.message && <p className="text-xs opacity-50 max-w-xs text-center">{this.state.message}</p>}
      </div>
    )
    return this.props.children
  }
}

function EmptyState() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)] select-none">
      <Box size={56} strokeWidth={1} aria-hidden="true" />
      <p className="text-sm font-medium">Click + or drag a component onto the canvas</p>
      <p className="text-xs opacity-60">Only parts with a 3D badge can be placed</p>
    </div>
  )
}

// ── Public export ──────────────────────────────────────────────────────────
export interface AssemblyCanvasProps {
  placedProducts: PlacedProduct[]
  wires: Wire[]
  pendingWireSourceId: string | null
  wiringMode: boolean
  onUpdatePosition: (instanceId: string, newPos: [number, number, number]) => void
  onDrop: (productId: string, clientX: number, clientY: number) => void
  onConnectorClick: (instanceId: string, worldPos: THREE.Vector3) => void
  onWireClick: (wireId: string, screenX: number, screenY: number) => void
  onDeleteInstance: (instanceId: string) => void
}

export function AssemblyCanvas({
  placedProducts, wires, pendingWireSourceId, wiringMode,
  onUpdatePosition, onDrop, onConnectorClick, onWireClick, onDeleteInstance,
}: AssemblyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const productId = e.dataTransfer.getData('productId')
    if (!productId) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    onDrop(productId, e.clientX - rect.left, e.clientY - rect.top)
  }

  const hasRenderable = placedProducts.some((p) => isLoadableUrl(p.product.modelUrl))

  return (
    <div ref={containerRef} className="w-full h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      {!hasRenderable ? <EmptyState /> : (
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0.5, 0.3, 1], fov: 50, near: 0.001, far: 100000 }}
            style={{ width: '100%', height: '100%' }}
            aria-label="3D assembly preview"
            gl={{ antialias: true, alpha: false, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
            onCreated={({ gl }) => { gl.setClearColor('#111111', 1) }}
          >
            <Scene
              placedProducts={placedProducts}
              wires={wires}
              pendingWireSourceId={pendingWireSourceId}
              wiringMode={wiringMode}
              onUpdatePosition={onUpdatePosition}
              onConnectorClick={onConnectorClick}
              onWireClick={onWireClick}
              onDeleteInstance={onDeleteInstance}
            />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}
