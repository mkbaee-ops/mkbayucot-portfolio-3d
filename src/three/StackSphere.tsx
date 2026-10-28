import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { stack } from '../data/profile'
import { LogoIcon } from '../components/ui'
import { glowTexture } from './glow'

const RADIUS = 3

function Monogram({ name }: { name: string }) {
  return <span className="grid size-5 place-items-center rounded bg-cyan/20 text-[10px] font-bold text-cyan">{name.slice(0, 2)}</span>
}

function Sphere() {
  const group = useRef<THREE.Group>(null)
  const labels = useRef<(HTMLDivElement | null)[]>([])
  const scrollSpin = useRef(0)
  const tmp = useMemo(() => new THREE.Vector3(), [])

  // Fibonacci distribution so labels are spaced evenly
  const points = useMemo(() => {
    const n = stack.length
    const golden = Math.PI * (3 - Math.sqrt(5))
    return stack.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      return new THREE.Vector3(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r).multiplyScalar(RADIUS)
    })
  }, [])

  const spokes = useMemo(() => {
    const arr = new Float32Array(points.length * 6)
    points.forEach((p, i) => p.toArray(arr, i * 6 + 3))
    return arr
  }, [points])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      scrollSpin.current += (window.scrollY - last) * 0.004
      last = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, scrollSpin.current, 3, dt)
    // Fade and shrink labels on the far side of the sphere (depth measured in camera space).
    const dist = state.camera.position.length()
    points.forEach((p, i) => {
      const el = labels.current[i]
      if (!el) return
      tmp.copy(p).applyMatrix4(g.matrixWorld).applyMatrix4(state.camera.matrixWorldInverse)
      const depth = THREE.MathUtils.clamp((dist + RADIUS + tmp.z) / (2 * RADIUS), 0, 1)
      el.style.opacity = String(0.25 + depth * 0.75)
      el.style.transform = `scale(${0.75 + depth * 0.35})`
    })
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[RADIUS * 0.98, 2]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.07} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[spokes, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.12} />
      </lineSegments>
      <sprite scale={2.6}>
        <spriteMaterial map={glowTexture()} color="#60a5fa" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      {stack.map((t, i) => (
        <Html key={t.name} position={points[i]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div
            ref={(el) => void (labels.current[i] = el)}
            aria-hidden="true"
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-display text-xs font-medium ${
              t.core ? 'border-cyan/50 bg-[#0b2530] text-white shadow-[0_0_18px_-4px_rgb(34_211_238/0.7)]' : 'border-white/10 bg-ink-2/90 text-fg/80'
            }`}
          >
            {t.icon ? <LogoIcon src={t.icon} /> : <Monogram name={t.name} />}
            {t.name}
          </div>
        </Html>
      ))}
    </group>
  )
}

function Rings() {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.2
    if (b.current) b.current.rotation.z -= dt * 0.15
  })
  return (
    <>
      <mesh ref={a} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[RADIUS * 1.25, 0.008, 8, 128]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 1.8, 0.4, 0]}>
        <torusGeometry args={[RADIUS * 1.4, 0.006, 8, 128]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </mesh>
    </>
  )
}

export default function StackSphere({ playing }: { playing: boolean }) {
  return (
    <Canvas frameloop={playing ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 45 }} gl={{ alpha: true, antialias: true }}>
      <Sphere />
      <Rings />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} rotateSpeed={0.6} />
    </Canvas>
  )
}
