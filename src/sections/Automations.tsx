import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useState, type KeyboardEvent } from 'react'
import { KIND_META, KindIcon } from '../components/StepKind'
import { StepList } from '../components/StepList'
import { ArrowUpRight, LogoIcon, Reveal, Section } from '../components/ui'
import { automationProjects as projects } from '../data/projects'
import type { Quality } from '../lib/device'
import { useInView } from '../lib/useInView'

const WorkflowScene = lazy(() => import('../three/WorkflowScene'))

const PLATFORM_ICON: Record<string, string> = {
  Zapier: '/icons/zapier.svg',
  n8n: '/icons/n8n.svg',
  'Make.com': '/icons/make.svg',
  'Claude Code': '/icons/claude.svg',
}

export function Automations({ quality }: { quality: Quality }) {
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(0)
  const { ref, visible, seen } = useInView<HTMLDivElement>('300px')
  const project = projects[active]
  const steps = project.steps ?? []
  const use3D = quality === 'full'

  const selectProject = (i: number) => {
    setActive(i)
    setStep(0)
  }

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!delta) return
    e.preventDefault()
    const next = (active + delta + projects.length) % projects.length
    selectProject(next)
    document.getElementById(`tab-${projects[next].id}`)?.focus()
  }

  const current = steps[step]

  return (
    <Section
      id="automations"
      index="02"
      eyebrow="Automation Projects"
      title={
        <>
          Watch the automations <span className="text-gradient">run.</span>
        </>
      }
      intro="Each build below is a real, shipped workflow. Nodes light up in run order as data moves through. Click any node to see what that step does."
    >
      <Reveal>
        <div role="tablist" aria-label="Automation projects" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {projects.map((p, i) => (
            <button
              key={p.id}
              id={`tab-${p.id}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="workflow-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => selectProject(i)}
              onKeyDown={onTabKey}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                i === active ? 'border-cyan/60 bg-cyan/10 text-white glow-ring' : 'border-line bg-white/[0.03] text-muted hover:border-white/25 hover:text-fg'
              }`}
            >
              {PLATFORM_ICON[p.platform ?? ''] && <LogoIcon src={PLATFORM_ICON[p.platform ?? '']} className="size-3.5 opacity-80" />}
              {p.title}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${project.id}`} className="glass mt-4 overflow-hidden rounded-3xl">
          <div className="grid gap-6 border-b border-line p-5 md:grid-cols-[1fr_auto] md:p-7">
            <div>
              <p className="eyebrow">
                {project.platform} · {steps.length} key steps
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-fg md:text-3xl">{project.title}</h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{project.description}</p>
            </div>
            {project.stats && (
              <dl className="flex gap-3 md:flex-col md:gap-2">
                {project.stats.map((s) => (
                  <div key={s.label} className="flex-1 rounded-xl border border-line bg-white/[0.03] px-3 py-2 md:min-w-40">
                    <dd className="font-display text-xl font-semibold text-gradient">{s.value}</dd>
                    <dt className="text-[11px] leading-tight text-muted">{s.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div ref={ref}>
            <div className="relative border-b border-line">
              {use3D ? (
                <>
                  <div className="relative h-[320px] xl:h-[360px]" aria-hidden="true">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(59_130_246/0.12),transparent_70%)]" />
                    {seen ? (
                      <Suspense fallback={<SceneLoading />}>
                        <WorkflowScene steps={steps} selected={step} onSelect={setStep} playing={visible} />
                      </Suspense>
                    ) : (
                      <SceneLoading />
                    )}
                  </div>
                  <div className="border-t border-line p-4 md:px-6">
                    <StepList variant="chips" steps={steps} selected={step} onSelect={setStep} label={`${project.title} steps`} />
                  </div>
                </>
              ) : (
                <div className="p-4 md:p-6">
                  <StepList variant="flow" steps={steps} selected={step} onSelect={setStep} label={`${project.title} steps`} />
                </div>
              )}
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[1fr_300px] md:gap-8 md:p-7">
              <div aria-live="polite" className="min-h-36">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div key={`${project.id}-${step}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider" style={{ color: KIND_META[current.kind].color }}>
                      <KindIcon kind={current.kind} className="size-4" />
                      Step {step + 1} of {steps.length} · {KIND_META[current.kind].label}
                    </p>
                    <h4 className="mt-2 font-display text-xl font-semibold text-fg">{current.label}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{current.detail}</p>
                    {current.branches && (
                      <ul aria-label="Branches" className="mt-3 flex flex-wrap gap-1.5">
                        {current.branches.map((b) => (
                          <li key={b} className="rounded-md border border-violet/30 bg-violet/10 px-2 py-0.5 text-[11px] text-violet-200">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              <div className="space-y-4">
                <ul aria-label="Tools used" className="flex flex-wrap gap-1.5">
                  {project.tools.map((t) => (
                    <li key={t} className="rounded-md border border-line bg-white/[0.04] px-2 py-1 text-[11px] text-fg/80">
                      {t}
                    </li>
                  ))}
                </ul>

                {project.image && (
                  <a href={project.image} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-line">
                    <img
                      src={project.image}
                      alt={project.imageAlt ?? `${project.title} build screenshot`}
                      loading="lazy"
                      decoding="async"
                      className="h-28 w-full bg-white object-cover object-top opacity-80 transition group-hover:opacity-100"
                    />
                    <span className="flex items-center justify-between bg-ink-2 px-3 py-2 text-xs text-muted group-hover:text-fg">
                      Proof of build (screenshot) <ArrowUpRight className="size-3.5" />
                    </span>
                  </a>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.caseStudyLink && (
                    <a href={project.caseStudyLink} target="_blank" rel="noreferrer" className="btn-primary !py-2.5">
                      Read the case study <ArrowUpRight />
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5">
                      Live <ArrowUpRight />
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5">
                      GitHub <ArrowUpRight />
                    </a>
                  )}
                  {project.deepDive && (
                    <a href={`#case-${project.deepDive}`} className="btn-primary !py-2.5">
                      Read the engineering case study
                    </a>
                  )}
                </div>
                {!project.githubLink && project.repoNote && <p className="text-xs text-muted">{project.repoNote}</p>}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function SceneLoading() {
  return (
    <div className="grid h-full place-items-center">
      <span className="size-8 animate-spin rounded-full border-2 border-cyan/20 border-t-cyan" />
    </div>
  )
}
