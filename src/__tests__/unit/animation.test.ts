import { describe, it, expect } from 'vitest'
import { animateDrone } from '@/lib/animation'

// Minimal mock objects matching the Three.js Object3D and Clock interfaces
function makeDrone() {
  return {
    position: { y: 0 },
    rotation: { y: 0 },
  }
}

function makeClock(elapsed: number) {
  return { getElapsedTime: () => elapsed }
}

describe('animateDrone', () => {
  it('sets position.y to sin(t * 0.8) * 0.15', () => {
    const t = 1.5
    const drone = makeDrone()
    animateDrone(drone as any, makeClock(t) as any)
    expect(drone.position.y).toBeCloseTo(Math.sin(t * 0.8) * 0.15, 10)
  })

  it('sets rotation.y to t * 0.3', () => {
    const t = 2.0
    const drone = makeDrone()
    animateDrone(drone as any, makeClock(t) as any)
    expect(drone.rotation.y).toBeCloseTo(t * 0.3, 10)
  })

  it('handles t = 0 correctly', () => {
    const drone = makeDrone()
    animateDrone(drone as any, makeClock(0) as any)
    expect(drone.position.y).toBeCloseTo(0, 10)
    expect(drone.rotation.y).toBeCloseTo(0, 10)
  })

  it('handles large t values', () => {
    const t = 1000
    const drone = makeDrone()
    animateDrone(drone as any, makeClock(t) as any)
    expect(drone.position.y).toBeCloseTo(Math.sin(t * 0.8) * 0.15, 10)
    expect(drone.rotation.y).toBeCloseTo(t * 0.3, 10)
  })
})
