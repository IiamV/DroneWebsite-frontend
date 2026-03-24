'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'
import { animateDrone } from '@/lib/animation'
import { groupEnd } from 'console'

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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  const gltf = useGLTF(`${basePath}/models/drone.glb`)
  const { scene, animations } = gltf
  const { actions } = useAnimations(animations, groupRef)
  const { clock } = useThree()

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        if (material.map) material.map = null;         
        material.metalness = 1.5; 
        material.roughness = 1;
      }
    });
  }, [scene]);

  useEffect(() => {
    // Access the specific "hover" action and play it
    const hoverAction = actions['hover'];
    
    if (hoverAction) {
      hoverAction.play();
    }
  }, [actions]);

  useFrame(() => {
    if (!groupRef.current) return

    animateDrone(groupRef.current, clock)

    const scrollFactor = Math.min(scrollY / 600, 1)
    groupRef.current.rotation.x = scrollFactor * 0.4

    groupRef.current.position.y=-1.8

    const baseScale = 13
    groupRef.current.scale.setScalar(baseScale * (1 - scrollFactor * 0.3))
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
