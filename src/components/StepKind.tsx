import type { StepKind } from '../data/projects'

export { KIND_META } from './kindMeta'

const PATHS: Record<StepKind, string> = {
  trigger: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  logic: 'M3 5h18l-7 8v6l-4 2v-8L3 5z',
  ai: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z',
  router: 'M5 4v6a4 4 0 0 0 4 4h6M5 4 3 6M5 4l2 2M15 14l-2-2m2 2-2 2M19 4v16M19 4l-2 2m2-2 2 2',
  data: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  action: 'M5 12h14M13 6l6 6-6 6',
  notify: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2zM10 20a2 2 0 0 0 4 0',
  schedule: 'M12 7v5l3 2M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
}

export function KindIcon({ kind, className = 'size-4' }: { kind: StepKind; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[kind]} />
    </svg>
  )
}
