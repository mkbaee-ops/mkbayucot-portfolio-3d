import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { PointerEvent } from 'react'
import { ArrowUpRight, GitHubIcon, Reveal, Section } from '../components/ui'
import { webProjects, type Project } from '../data/projects'

function TiltCard({ project }: { project: Project }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 180, damping: 18 })

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <article onPointerMove={onMove} onPointerLeave={reset} className="h-full [perspective:1200px]">
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glass flex h-full flex-col rounded-3xl p-5"
      >
        {/* Laptop mockup */}
        <div style={{ transform: 'translateZ(40px)' }} className="relative">
          <div className="rounded-t-xl border border-white/15 bg-[#0b0e17] p-1.5 pb-2 shadow-[0_30px_60px_-25px_rgb(34_211_238/0.45)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-ink-2">
              {project.image ? (
                <img src={project.image} alt={project.imageAlt ?? `${project.title} screenshot`} loading="lazy" decoding="async" className="size-full object-cover object-top" />
              ) : (
                <div aria-hidden="true" className="grid size-full place-items-center bg-[linear-gradient(135deg,rgb(34_211_238/0.12),rgb(139_92_246/0.12))] font-display text-lg text-fg/70">
                  {project.title}
                </div>
              )}
            </div>
          </div>
          <div aria-hidden="true" className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-xl bg-gradient-to-b from-[#2a3142] to-[#141826]" />
        </div>

        <div style={{ transform: 'translateZ(20px)' }} className="mt-6 flex flex-1 flex-col">
          <p className="eyebrow">{project.platform}</p>
          <h3 className="mt-2 text-xl font-semibold text-fg">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
          <ul aria-label="Tools used" className="mt-4 flex flex-wrap gap-1.5">
            {project.tools.map((t) => (
              <li key={t} className="rounded-md border border-line bg-white/[0.04] px-2 py-1 text-[11px] text-fg/80">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn-primary !py-2.5">
                Live site <ArrowUpRight />
                <span className="sr-only">: {project.title}</span>
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5">
                <GitHubIcon /> Code
                <span className="sr-only">: {project.title} on GitHub</span>
              </a>
            )}
            {project.deepDive && (
              <a href={`#case-${project.deepDive}`} className="btn-ghost !py-2.5">
                Case study
                <span className="sr-only">: {project.title}</span>
              </a>
            )}
          </div>
          {!project.githubLink && project.repoNote && <p className="mt-3 text-xs text-muted">{project.repoNote}</p>}
        </div>
      </motion.div>
    </article>
  )
}

export function WebProjects() {
  return (
    <Section
      id="web"
      index="03"
      eyebrow="Web Apps & Landing Pages"
      title={
        <>
          Shipped to the web, <span className="text-gradient">not just to a canvas.</span>
        </>
      }
      intro="Full-stack apps and sites built with Claude Code, GitHub, Supabase and Vercel."
    >
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {webProjects.map((p, i) => (
          <li key={p.id}>
            <Reveal delay={i * 0.08} className="h-full">
              <TiltCard project={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
