import type { Object3D, Clock } from 'three'

/**
 * Animates a drone object with sinusoidal Y-axis hover and continuous Y-axis rotation.
 * Pure and stateless — no module-level mutable state.
 */
export function animateDrone(drone: Object3D, clock: Clock): void {
  const t = clock.getElapsedTime()
  drone.position.y = Math.sin(t * 0.8) * 0.15
  drone.rotation.y = t * 0.3
}
