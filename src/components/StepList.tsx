import type { KeyboardEvent } from 'react'
import type { WorkflowStep } from '../data/projects'
import { KIND_META, KindIcon } from './StepKind'

const STAGGER = 0.6 // seconds between node flashes in the 2D flow

/**
 * The accessible control for workflow steps.
 * - `chips`: compact row under the 3D scene (desktop)
 * - `flow`:  vertical animated flow chart (mobile / low-power / reduced motion fallback)
 */
export function StepList({ steps, selected, onSelect, variant, label }: {
  steps: WorkflowStep[]
  selected: number
  onSelect: (i: number) => void
  variant: 'chips' | 'flow'
  label: string
}) {
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: steps.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const clamped = Math.max(0, Math.min(steps.length - 1, next))
    onSelect(clamped)
    ;(e.currentTarget.parentElement?.parentElement?.children[clamped]?.querySelector('button') as HTMLButtonElement | null)?.focus()
  }

  if (variant === 'chips') {
    return (
      <ol aria-label={label} className="flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={selected === i}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selected === i ? 'border-cyan/70 bg-cyan/15 text-white' : 'border-line bg-white/[0.03] text-muted hover:border-white/25 hover:text-fg'
              }`}
            >
              <span className="text-[10px] tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span style={{ color: KIND_META[s.kind].color }}>
                <KindIcon kind={s.kind} className="size-3.5" />
              </span>
              {s.label}
            </button>
          </li>
        ))}
      </ol>
    )
  }

  const duration = `${steps.length * STAGGER}s`
  return (
    <ol aria-label={label} className="flex flex-col">
      {steps.map((s, i) => (
        <li key={i} className="flex flex-col items-stretch">
          <button
            type="button"
            aria-pressed={selected === i}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => onKey(e, i)}
            style={{ animationDuration: duration, animationDelay: `${i * STAGGER}s` }}
            className={`node-seq flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
              selected === i ? 'border-cyan/70 bg-cyan/10' : 'border-line bg-ink-2/80 hover:border-white/25'
            }`}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5" style={{ color: KIND_META[s.kind].color }}>
              <KindIcon kind={s.kind} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-medium text-fg">{s.label}</span>
              {s.branches && <span className="block truncate text-[11px] text-violet-200/80">{s.branches.join(' · ')}</span>}
            </span>
            <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-muted">{KIND_META[s.kind].label}</span>
          </button>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="relative mx-auto h-5 w-px bg-gradient-to-b from-cyan/50 to-violet/50">
              <span className="packet absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_8px_2px_rgb(34_211_238/0.7)]" style={{ animationDelay: `${i * STAGGER}s` }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
