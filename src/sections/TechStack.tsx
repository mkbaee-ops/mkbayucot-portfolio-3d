import { lazy, Suspense } from 'react'
import { Reveal, Section } from '../components/ui'
import { stack } from '../data/profile'
import type { Quality } from '../lib/device'
import { useInView } from '../lib/useInView'

const StackSphere = lazy(() => import('../three/StackSphere'))

export function TechStack({ quality }: { quality: Quality }) {
  const { ref, visible, seen } = useInView<HTMLDivElement>('300px')
  const use3D = quality === 'full'

  const list = (
    <ul aria-label="Tools I use" className={use3D ? 'sr-only' : 'flex flex-wrap gap-2'}>
      {stack.map((t) => (
        <li
          key={t.name}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${t.core ? 'border-cyan/40 bg-cyan/10 text-white' : 'border-line bg-white/[0.03] text-fg/80'}`}
        >
          {t.icon ? (
            <img src={t.icon} alt="" width={16} height={16} loading="lazy" className="size-4" />
          ) : (
            <span aria-hidden="true" className="grid size-4 place-items-center rounded bg-cyan/20 text-[8px] font-bold text-cyan">
              {t.name.slice(0, 2)}
            </span>
          )}
          {t.name}
        </li>
      ))}
    </ul>
  )

  return (
    <Section
      id="stack"
      index="04"
      eyebrow="Tech Stack"
      title={
        <>
          The tools behind <span className="text-gradient">the systems.</span>
        </>
      }
      intro={use3D ? 'Drag to spin. Scrolling turns it too. Highlighted tools are my core stack.' : 'Highlighted tools are my core stack.'}
    >
      <Reveal>
        {use3D ? (
          <div ref={ref} className="relative mx-auto h-[460px] max-w-3xl cursor-grab active:cursor-grabbing md:h-[540px]" aria-hidden="true">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(139_92_246/0.15),transparent_60%)]" />
            {seen && (
              <Suspense fallback={null}>
                <StackSphere playing={visible} />
              </Suspense>
            )}
          </div>
        ) : null}
        {list}
      </Reveal>
    </Section>
  )
}
