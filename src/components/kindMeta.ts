import type { StepKind } from '../data/projects'

export const KIND_META: Record<StepKind, { color: string; label: string }> = {
  trigger: { color: '#22d3ee', label: 'Trigger' },
  logic: { color: '#60a5fa', label: 'Logic' },
  ai: { color: '#a78bfa', label: 'AI' },
  router: { color: '#818cf8', label: 'Router' },
  data: { color: '#2dd4bf', label: 'Data' },
  action: { color: '#38bdf8', label: 'Action' },
  notify: { color: '#67e8f9', label: 'Notify' },
  schedule: { color: '#c084fc', label: 'Schedule' },
}
