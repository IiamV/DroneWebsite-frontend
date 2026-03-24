'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Model({ url }: { url: string }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  const { scene } = useGLTF(`${base}${url}`)
  const pivotRef = useRef<THREE.Group>(null)  // outer group — spins
  const meshRef = useRef<THREE.Group>(null)   // inner group — offset to center
  const { camera } = useThree()

  // Center model and fit camera on load
  useEffect(() => {
    if (!meshRef.current) return

    const box = new THREE.Box3().setFromObject(meshRef.current)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)

    // Offset the mesh so its bounding-box center aligns with the pivot origin
    meshRef.current.position.set(-center.x, -center.y, -center.z)

    // Fit camera to model size
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
    const distance = (maxDim / 2) / Math.tan(fov / 2) * 1.6

    camera.position.set(0, 0, distance)
    camera.near = distance * 0.001
    camera.far = distance * 100
    camera.updateProjectionMatrix()
  }, [scene, camera])

  // Rotate the outer pivot — spins around the model's true center
  useFrame((_, delta) => {
    if (pivotRef.current) pivotRef.current.rotation.y += delta * 0.4
  })

  return (
    <group ref={pivotRef}>
      <group ref={meshRef}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

interface ProductCanvasProps {
  modelUrl: string
  productName: string
}

export default function ProductCanvas({ modelUrl, productName }: ProductCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50, near: 0.001, far: 10000 }}
      style={{ width: '100%', height: '100%' }}
      aria-label={`3D model of ${productName}`}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />
      <Model url={modelUrl} />
      <OrbitControls enableZoom={true} enablePan={false} maxDistance={500} />
    </Canvas>
  )
}
