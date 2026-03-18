'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'
import { animateDrone } from '@/lib/animation'

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

// Particle field rendered behind the drone
function ParticleField() {
  const count = 200
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.25} />
    </points>
  )
}

interface DroneModelProps {
  scrollY: number
}

function DroneModel({ scrollY }: DroneModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/drone.glb')
  const { clock } = useThree()

  useFrame(() => {
    if (!groupRef.current) return
    animateDrone(groupRef.current, clock)

    // Scroll-based tilt and scale
    const scrollFactor = Math.min(scrollY / 600, 1)
    groupRef.current.rotation.x = scrollFactor * 0.4
    groupRef.current.scale.setScalar(1 - scrollFactor * 0.3)
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function DroneFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image
        src="/models/drone-fallback.png"
        alt="Drone"
        width={480}
        height={360}
        priority
        className="object-contain"
      />
    </div>
  )
}

export default function DroneCanvas() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setWebGLSupported(supportsWebGL())
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Still detecting
  if (webGLSupported === null) return null

  if (!webGLSupported) return <DroneFallback />

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      aria-label="3D drone animation"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ParticleField />
      <DroneModel scrollY={scrollY} />
    </Canvas>
  )
}
