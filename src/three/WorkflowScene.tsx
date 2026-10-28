import { Html, Line, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Line2 } from 'three-stdlib'
import { KIND_META, KindIcon } from '../components/StepKind'
import type { WorkflowStep } from '../data/projects'
import { glowTexture } from './glow'

const SPACING = 1.9
const SEG = 0.75 // seconds a pulse spends on each connection
const HOLD = 1.6 // pause at the end of a run before replaying

type Layout = {
  nodes: THREE.Vector3[]
  branches: { parent: number; pos: THREE.Vector3; label: string }[]
  curves: THREE.QuadraticBezierCurve3[]
  branchCurves: THREE.QuadraticBezierCurve3[]
  cycle: number
}

function arc(a: THREE.Vector3, b: THREE.Vector3, lift: number) {
  const mid = a.clone().lerp(b, 0.5)
  mid.y += lift
  mid.z += 0.25
  return new THREE.QuadraticBezierCurve3(a, mid, b)
}

function buildLayout(steps: WorkflowStep[]): Layout {
  const n = steps.length
  const nodes = steps.map((_, i) => new THREE.Vector3((i - (n - 1) / 2) * SPACING, Math.sin(i * 0.85) * 0.4, Math.cos(i * 0.7) * 0.35))
  const branches: Layout['branches'] = []
  steps.forEach((s, i) => {
    const b = s.branches?.length ?? 0
    s.branches?.forEach((label, j) => {
      const p = nodes[i]
      branches.push({ parent: i, label, pos: new THREE.Vector3(p.x + (j - (b - 1) / 2) * 0.62, p.y - 1.75, p.z + 0.45) })
    })
  })
  const curves = nodes.slice(1).map((b, i) => arc(nodes[i], b, 0.3))
  const branchCurves = branches.map((br) => arc(nodes[br.parent], br.pos, -0.1))
  return { nodes, branches, curves, branchCurves, cycle: (n - 1) * SEG + SEG + HOLD }
}

/** 0.1 before the pulse arrives, a flash on arrival, then a steady "visited" glow. */
function glowAt(T: number, arrival: number) {
  if (T < arrival) return 0.1
  return 0.35 + 1.1 * Math.exp(-(T - arrival) * 2.5)
}

function FitCamera({ steps }: { steps: number }) {
  const { camera, size } = useThree()
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const width = (steps - 1) * SPACING + 2.4
    const half = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    const aspect = size.width / size.height
    cam.position.z = Math.max(width / (2 * half * aspect), 4.6 / (2 * half))
    cam.updateProjectionMatrix()
  }, [camera, size, steps])
  useFrame((state, dt) => {
    // Subtle orbit toward the pointer for depth.
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.8, 2, dt)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, -0.1 + state.pointer.y * 0.4, 2, dt)
    state.camera.lookAt(0, -0.2, 0)
  })
  return null
}

function Label({ text, kind, position, below, active }: { text: string; kind?: WorkflowStep['kind']; position: THREE.Vector3; below?: boolean; active?: boolean }) {
  return (
    <Html position={[position.x, position.y + (below ? -0.78 : 0.78), position.z]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div
        aria-hidden="true"
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 font-display text-[11px] font-medium transition-colors ${
          active ? 'border-cyan/70 bg-[#0c2a36] text-white' : 'border-white/10 bg-ink-2/90 text-fg/85'
        }`}
      >
        {kind && <KindIcon kind={kind} className="size-3" />}
        {text}
      </div>
    </Html>
  )
}

function StepNode({ step, index, pos, arrival, cycle, selected, onSelect }: {
  step: WorkflowStep
  index: number
  pos: THREE.Vector3
  arrival: number
  cycle: number
  selected: boolean
  onSelect: (i: number) => void
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const halo = useRef<THREE.Sprite>(null)
  const ring = useRef<THREE.Mesh>(null)
  const group = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  const color = KIND_META[step.kind].color

  useFrame((state, dt) => {
    const T = state.clock.elapsedTime % cycle
    const g = glowAt(T, arrival) + (selected ? 0.5 : 0) + (hover ? 0.3 : 0)
    if (mat.current) mat.current.emissiveIntensity = g
    if (halo.current) halo.current.scale.setScalar(1.2 + g * 0.9)
    if (ring.current) ring.current.rotation.z += dt * 1.2
    if (group.current) {
      const s = THREE.MathUtils.damp(group.current.scale.x, selected || hover ? 1.14 : 1, 8, dt)
      group.current.scale.setScalar(s)
    }
  })

  return (
    <group position={pos}>
      <group ref={group}>
        <sprite ref={halo}>
          <spriteMaterial map={glowTexture()} color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        <RoundedBox
          args={[0.86, 0.86, 0.3]}
          radius={0.14}
          smoothness={3}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(index)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHover(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHover(false)
            document.body.style.cursor = ''
          }}
        >
          <meshStandardMaterial ref={mat} color="#0b1222" emissive={color} emissiveIntensity={0.2} roughness={0.35} metalness={0.6} />
        </RoundedBox>
        {selected && (
          <mesh ref={ring} position={[0, 0, 0.17]}>
            <torusGeometry args={[0.64, 0.018, 8, 64]} />
            <meshBasicMaterial color="#e0fbff" />
          </mesh>
        )}
      </group>
    </group>
  )
}

function Connection({ curve, from, cycle }: { curve: THREE.QuadraticBezierCurve3; from: number; cycle: number }) {
  const ref = useRef<Line2>(null)
  const points = useMemo(() => curve.getPoints(20), [curve])
  useFrame((state) => {
    const T = state.clock.elapsedTime % cycle
    const lit = T >= from ? 0.75 : 0.18
    if (ref.current) ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, lit, 0.15)
  })
  return <Line ref={ref} points={points} color="#5ab8ff" lineWidth={1.6} transparent opacity={0.18} />
}

/** Bright packets riding the curves, timed to the node sequence. */
function Pulses({ layout }: { layout: Layout }) {
  const tex = glowTexture()
  const main = useRef<THREE.Sprite[]>([])
  const side = useRef<THREE.Sprite[]>([])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const T = state.clock.elapsedTime % layout.cycle
    const e = Math.floor(T / SEG)
    const t = (T % SEG) / SEG
    // Head + two trailing sprites on the active connection.
    main.current.forEach((s, k) => {
      if (!s) return
      const curve = layout.curves[e]
      const tk = t - k * 0.07
      s.visible = !!curve && tk > 0
      if (s.visible) s.position.copy(curve.getPoint(tk))
    })
    // Branch packets fan out from a node while the main pulse leaves it.
    layout.branches.forEach((br, k) => {
      const s = side.current[k]
      if (!s) return
      const local = (T - br.parent * SEG) / SEG
      s.visible = local > 0 && local < 1
      if (s.visible) s.position.copy(layout.branchCurves[k].getPoint(local, tmp))
    })
  })

  return (
    <>
      {[0, 1, 2].map((k) => (
        <sprite key={k} ref={(el) => void (main.current[k] = el!)} scale={0.55 - k * 0.14}>
          <spriteMaterial map={tex} color="#d9fbff" transparent opacity={1 - k * 0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      ))}
      {layout.branches.map((_, k) => (
        <sprite key={`b${k}`} ref={(el) => void (side.current[k] = el!)} scale={0.32}>
          <spriteMaterial map={tex} color="#c4b5fd" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      ))}
    </>
  )
}

function Branch({ pos, parentArrival, cycle }: { pos: THREE.Vector3; parentArrival: number; cycle: number }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state) => {
    const T = state.clock.elapsedTime % cycle
    if (mat.current) mat.current.opacity = Math.min(1, glowAt(T, parentArrival + SEG) * 0.9)
  })
  return (
    <mesh position={pos}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial ref={mat} color="#a78bfa" transparent opacity={0.1} />
    </mesh>
  )
}

function Workflow({ steps, selected, onSelect }: { steps: WorkflowStep[]; selected: number; onSelect: (i: number) => void }) {
  const layout = useMemo(() => buildLayout(steps), [steps])
  return (
    <group>
      {layout.curves.map((c, i) => (
        <Connection key={`c${i}`} curve={c} from={i * SEG} cycle={layout.cycle} />
      ))}
      {layout.branchCurves.map((c, i) => (
        <Connection key={`bc${i}`} curve={c} from={layout.branches[i].parent * SEG} cycle={layout.cycle} />
      ))}
      {steps.map((s, i) => (
        <StepNode key={i} step={s} index={i} pos={layout.nodes[i]} arrival={i * SEG} cycle={layout.cycle} selected={selected === i} onSelect={onSelect} />
      ))}
      {layout.branches.map((b, i) => (
        <Branch key={`b${i}`} pos={b.pos} parentArrival={b.parent * SEG} cycle={layout.cycle} />
      ))}
      <Pulses layout={layout} />
      {steps.map((s, i) => (
        <Label key={`l${i}`} text={s.label} kind={s.kind} position={layout.nodes[i]} below={i % 2 === 1} active={selected === i} />
      ))}
      {layout.branches.map((b, i) => (
        // Stagger branch labels on two rows so neighbours never overlap
        <Html key={`bl${i}`} position={[b.pos.x, b.pos.y - (i % 2 ? 0.55 : 0.28), b.pos.z]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <span aria-hidden="true" className="whitespace-nowrap font-display text-[10px] text-violet-200/80">
            {b.label}
          </span>
        </Html>
      ))}
    </group>
  )
}

export default function WorkflowScene({ steps, selected, onSelect, playing }: {
  steps: WorkflowStep[]
  selected: number
  onSelect: (i: number) => void
  playing: boolean
}) {
  return (
    <Canvas
      frameloop={playing ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, -0.35, 12], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => (document.body.style.cursor = '')}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[-6, 4, 6]} intensity={40} color="#22d3ee" />
      <pointLight position={[6, -3, 5]} intensity={30} color="#8b5cf6" />
      <FitCamera steps={steps.length} />
      <Workflow steps={steps} selected={selected} onSelect={onSelect} />
    </Canvas>
  )
}
