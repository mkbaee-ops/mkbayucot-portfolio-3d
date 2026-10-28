import * as THREE from 'three'

let cached: THREE.Texture | null = null

/** Soft radial sprite used for every glowing point. Generated once, no image download. */
export function glowTexture() {
  if (cached) return cached
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.2, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.25)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  cached = new THREE.CanvasTexture(canvas)
  cached.colorSpace = THREE.SRGBColorSpace
  return cached
}

export const palette = {
  cyan: new THREE.Color('#22d3ee'),
  blue: new THREE.Color('#3b82f6'),
  violet: new THREE.Color('#8b5cf6'),
  white: new THREE.Color('#e6f6ff'),
}
