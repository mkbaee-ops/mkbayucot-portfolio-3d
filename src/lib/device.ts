import { useEffect, useState } from 'react'

/**
 * full   – desktop-class device: all 3D scenes
 * lite   – phones / low-power devices: lighter background scene, 2D fallbacks elsewhere
 * static – reduced motion or no WebGL: no canvases at all
 */
export type Quality = 'full' | 'lite' | 'static'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function detect(): Quality {
  if (typeof window === 'undefined') return 'static'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'
  if (!hasWebGL()) return 'static'
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const small = window.matchMedia('(max-width: 767px)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const weakCpu = (nav.hardwareConcurrency ?? 8) <= 4
  const lowMem = (nav.deviceMemory ?? 8) <= 4
  if (small || coarse || weakCpu || lowMem || nav.connection?.saveData) return 'lite'
  return 'full'
}

export function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>(detect)
  useEffect(() => {
    const queries = ['(prefers-reduced-motion: reduce)', '(max-width: 767px)'].map((q) => window.matchMedia(q))
    const update = () => setQuality(detect())
    queries.forEach((q) => q.addEventListener('change', update))
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])
  return quality
}
