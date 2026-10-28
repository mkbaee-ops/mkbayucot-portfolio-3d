import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Quality } from '../lib/device'
import { glowTexture, palette } from './glow'

// Shared, mutation-only input state (no React re-renders per frame).
const input = { px: 0, py: 0, scroll: 0 }

function useInputTracking() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      input.px = (e.clientX / window.innerWidth) * 2 - 1
      input.py = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      input.scroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    onScroll()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FLIGHT_DEPTH = 120

/** Scroll → camera dolly through the scene, with gentle mouse parallax. */
function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(), [])
  const smooth = useRef(0)
  useFrame((state, dt) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, input.scroll, 3, dt)
    const p = smooth.current
    const cam = state.camera
    const tx = Math.sin(p * Math.PI * 2.5) * 1.6 + input.px * 0.45
    const ty = Math.cos(p * Math.PI * 1.5) * 0.4 - 0.4 + input.py * 0.3
    const tz = 9 - p * FLIGHT_DEPTH
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 2.5, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty, 2.5, dt)
    cam.position.z = tz
    look.set(cam.position.x * 0.6, cam.position.y * 0.5, tz - 10)
    cam.lookAt(look)
  })
  return null
}

type NetworkProps = {
  count: number
  radius: number
  seed: number
  pulses: number
  interactive?: boolean
  position?: [number, number, number]
  opacity?: number
}

/** Glowing neural-net: nodes on a jittered sphere, k-nearest edges, and data pulses walking the graph. */
function NeuralNetwork({ count, radius, seed, pulses, interactive, position = [0, 0, 0], opacity = 1 }: NetworkProps) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const pulseGeo = useRef<THREE.BufferGeometry>(null)

  const graph = useMemo(() => {
    const rand = mulberry32(seed)
    const nodes: THREE.Vector3[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      const shell = i % 5 === 0 ? 0.45 + rand() * 0.25 : 0.82 + rand() * 0.25
      nodes.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(radius * shell))
    }

    const adjacency: number[][] = nodes.map(() => [])
    const edgeSet = new Set<string>()
    nodes.forEach((a, i) => {
      const nearest = nodes
        .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
        .filter((n) => n.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 3)
      for (const { j } of nearest) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (edgeSet.has(key)) continue
        edgeSet.add(key)
        adjacency[i].push(j)
        adjacency[j].push(i)
      }
    })

    const nodePos = new Float32Array(count * 3)
    const nodeCol = new Float32Array(count * 3)
    const c = new THREE.Color()
    nodes.forEach((n, i) => {
      n.toArray(nodePos, i * 3)
      c.copy(palette.cyan).lerp(palette.violet, (n.y / radius + 1) / 2)
      if (i % 7 === 0) c.lerp(palette.white, 0.5)
      c.toArray(nodeCol, i * 3)
    })

    const edges = [...edgeSet].map((k) => k.split('-').map(Number) as [number, number])
    const linePos = new Float32Array(edges.length * 6)
    const lineCol = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(linePos, i * 6)
      nodes[b].toArray(linePos, i * 6 + 3)
      c.fromArray(nodeCol, a * 3).toArray(lineCol, i * 6)
      c.fromArray(nodeCol, b * 3).toArray(lineCol, i * 6 + 3)
    })

    const walkers = Array.from({ length: pulses }, () => {
      const from = Math.floor(rand() * count)
      const to = adjacency[from][0] ?? from
      return { from, to, t: rand(), speed: 0.5 + rand() * 0.9 }
    })

    return { nodes, adjacency, nodePos, nodeCol, linePos, lineCol, walkers, rand }
  }, [count, radius, seed, pulses])

  const pulsePositions = useMemo(() => new Float32Array(pulses * 3), [pulses])
  const tex = glowTexture()

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    if (interactive) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, t * 0.06 + input.px * 0.6, 2, dt)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -input.py * 0.35, 2, dt)
    } else {
      g.rotation.y += dt * 0.05
    }
    if (core.current) {
      core.current.rotation.x += dt * 0.15
      core.current.rotation.y -= dt * 0.1
    }

    // Advance pulses along edges; on arrival hop to a random neighbour.
    const { nodes, adjacency, walkers, rand } = graph
    walkers.forEach((w, i) => {
      w.t += dt * w.speed
      if (w.t >= 1) {
        w.t = 0
        const next = adjacency[w.to]
        w.from = w.to
        w.to = next[Math.floor(rand() * next.length)] ?? w.from
      }
      const a = nodes[w.from]
      const b = nodes[w.to]
      pulsePositions[i * 3] = a.x + (b.x - a.x) * w.t
      pulsePositions[i * 3 + 1] = a.y + (b.y - a.y) * w.t
      pulsePositions[i * 3 + 2] = a.z + (b.z - a.z) * w.t
    })
    const attr = pulseGeo.current?.getAttribute('position')
    if (attr) attr.needsUpdate = true
  })

  return (
    <group position={position}>
      <group ref={group}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[graph.linePos, 3]} />
            <bufferAttribute attach="attributes-color" args={[graph.lineCol, 3]} />
          </bufferGeometry>
          <lineBasicMaterial vertexColors transparent opacity={0.22 * opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[graph.nodePos, 3]} />
            <bufferAttribute attach="attributes-color" args={[graph.nodeCol, 3]} />
          </bufferGeometry>
          <pointsMaterial map={tex} size={radius * 0.075} vertexColors transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
        <points>
          <bufferGeometry ref={pulseGeo}>
            <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial map={tex} size={radius * 0.11} color="#bff6ff" transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
        <mesh ref={core}>
          <icosahedronGeometry args={[radius * 0.32, 1]} />
          <meshBasicMaterial color={palette.blue} wireframe transparent opacity={0.18 * opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

/** Star-like data particles spread through the flight tunnel. */
function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, colors } = useMemo(() => {
    const rand = mulberry32(7)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2
      const r = 3 + rand() * 14
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = Math.sin(a) * r * 0.7
      positions[i * 3 + 2] = 14 - rand() * (FLIGHT_DEPTH + 30)
      c.copy(palette.cyan).lerp(palette.violet, rand())
      c.toArray(colors, i * 3)
    }
    return { positions, colors }
  }, [count])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.012
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial map={glowTexture()} size={0.12} vertexColors transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function HeroNetwork({ lite }: { lite: boolean }) {
  const { size } = useThree()
  const wide = size.width >= 1024
  // Sit to the right of the headline on wide screens; centred (and dimmer) behind it on small ones.
  return (
    <NeuralNetwork
      count={lite ? 55 : 110}
      radius={wide ? 3.3 : 2.8}
      seed={42}
      pulses={lite ? 10 : 26}
      interactive
      position={wide ? [3.4, 0.1, 0] : [0, 0.6, -1.5]}
      opacity={wide ? 1 : 0.6}
    />
  )
}

const CLUSTERS: { z: number; x: number; y: number; seed: number }[] = [
  { z: -24, x: -6, y: 1, seed: 3 },
  { z: -48, x: 6, y: -1.5, seed: 11 },
  { z: -72, x: -5.5, y: -1, seed: 19 },
  { z: -98, x: 5.5, y: 1.2, seed: 27 },
]

export default function BackgroundScene({ quality, onReady }: { quality: Quality; onReady?: () => void }) {
  useInputTracking()
  const lite = quality === 'lite'
  const clusters = lite ? CLUSTERS.filter((_, i) => i % 2 === 0) : CLUSTERS

  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 80 }}
      gl={{ antialias: !lite, alpha: false, powerPreference: lite ? 'low-power' : 'high-performance' }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <color attach="background" args={['#05060a']} />
      <fog attach="fog" args={['#05060a', 8, 42]} />
      <CameraRig />
      <HeroNetwork lite={lite} />
      {clusters.map((c) => (
        <NeuralNetwork key={c.seed} count={lite ? 28 : 44} radius={2.4} seed={c.seed} pulses={lite ? 4 : 10} position={[c.x, c.y, c.z]} opacity={0.85} />
      ))}
      <ParticleField count={lite ? 600 : 1600} />
    </Canvas>
  )
}
