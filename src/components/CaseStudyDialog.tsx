import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'
import { ArrowUpRight } from './ui'

/** Full automation case study in a native modal <dialog> (focus trap, Esc to close and a11y for free). */
export function CaseStudyDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (project && !dialog.open) {
      dialog.showModal()
      dialog.scrollTop = 0
      document.documentElement.style.overflow = 'hidden'
    } else if (!project && dialog.open) {
      dialog.close()
    }
    if (!project) document.documentElement.style.overflow = ''
  }, [project])

  const cs = project?.caseStudy

  return (
    <dialog
      ref={ref}
      aria-labelledby="cs-dialog-title"
      onClose={onClose}
      // a click on the backdrop lands on the <dialog> element itself
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto max-h-[92svh] w-[min(56rem,calc(100vw-1.5rem))] overflow-y-auto rounded-3xl border border-line bg-ink-2 p-0 text-fg shadow-2xl backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      {project && cs && (
        <article className="p-5 md:p-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{project.platform} · Case study</p>
              <h2 id="cs-dialog-title" className="mt-2 text-2xl font-semibold md:text-3xl">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-fg hover:border-cyan/50"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <p className="mt-4 leading-relaxed text-fg/85">{project.description}</p>

          {project.stats && (
            <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {project.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse justify-end rounded-2xl border border-line bg-white/[0.03] p-3 sm:p-4">
                  <dt className="mt-1 text-[11px] leading-snug text-muted sm:text-xs">{s.label}</dt>
                  <dd className="font-display text-xl font-semibold text-gradient sm:text-2xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <h3 className="eyebrow mt-8">How it works</h3>
          <ol className="mt-3 grid gap-3 sm:grid-cols-2">
            {cs.howItWorks.map((h, i) => (
              <li key={h.title} className="rounded-2xl border border-line bg-white/[0.03] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-violet-300">
                  {String(i + 1).padStart(2, '0')} · {h.stage}
                </p>
                <p className="mt-1 font-display font-semibold">{h.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{h.body}</p>
              </li>
            ))}
          </ol>

          <h3 className="eyebrow mt-8">Proof of build</h3>
          <ul className="mt-3 space-y-6">
            {cs.proof.map((pr) => (
              <li key={pr.image}>
                <figure className="overflow-hidden rounded-2xl border border-line">
                  <a href={pr.image} target="_blank" rel="noreferrer" className="block bg-white">
                    <img src={pr.image} alt={pr.alt} loading="lazy" decoding="async" className="max-h-[420px] w-full object-contain" />
                  </a>
                  <figcaption className="bg-white/[0.03] p-4">
                    <p className="font-display font-semibold">{pr.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{pr.caption}</p>
                    {pr.points && (
                      <ul className="mt-2 space-y-1">
                        {pr.points.map((pt) => (
                          <li key={pt} className="flex gap-2 text-sm text-fg/80">
                            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <ul aria-label="Tools used" className="mt-8 flex flex-wrap gap-1.5 border-t border-line pt-5">
            {project.tools.map((t) => (
              <li key={t} className="rounded-md border border-line bg-white/[0.04] px-2 py-1 text-[11px] text-fg/80">
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-muted">
            Screenshots open full size in a new tab{' '}
            <ArrowUpRight className="inline size-3.5" />
          </p>
        </article>
      )}
    </dialog>
  )
}
