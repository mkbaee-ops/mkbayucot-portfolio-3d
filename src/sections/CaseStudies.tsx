import { Fragment } from 'react'
import { ArrowUpRight, Reveal, Section } from '../components/ui'
import { caseStudies, type CaseStudy } from '../data/caseStudies'

function Diagram({ layers, label }: { layers: CaseStudy['architecture']; label: string }) {
  return (
    <figure aria-label={label} className="rounded-2xl border border-line bg-ink-2/60 p-4 md:p-5">
      <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch">
        {layers.map((layer, i) => (
          <Fragment key={layer.title}>
            <li className="flex-1 rounded-xl border border-cyan/20 bg-cyan/[0.04] p-3">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">{layer.title}</p>
              <ul className="mt-2 space-y-1.5">
                {layer.items.map((item) => (
                  <li key={item} className="rounded-md border border-white/10 bg-ink/70 px-2 py-1.5 text-xs leading-snug text-fg/85">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
            {i < layers.length - 1 && (
              <li aria-hidden="true" className="grid place-items-center text-violet-300/80">
                <svg viewBox="0 0 24 24" className="size-5 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
      <figcaption className="mt-3 text-[11px] text-muted">Architecture, left to right: how a request flows through the system.</figcaption>
    </figure>
  )
}

function Block({ label, title, children }: { label: string; title?: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="eyebrow">{label}</h4>
      {title && <p className="mt-2 font-display text-lg font-semibold text-fg">{title}</p>}
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  )
}

export function CaseStudies() {
  return (
    <Section
      id="case-studies"
      index="04"
      eyebrow="Engineering Case Studies"
      title={
        <>
          How the two biggest builds <span className="text-gradient">actually work.</span>
        </>
      }
      intro="The problem, the architecture, one hard decision, what broke, and what changed."
    >
      <div className="space-y-10">
        {caseStudies.map((cs) => (
          <Reveal key={cs.id}>
            <article id={`case-${cs.id}`} aria-labelledby={`case-${cs.id}-title`} className="glass scroll-mt-20 rounded-3xl p-5 md:p-8">
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="eyebrow">{cs.kicker}</p>
                  <h3 id={`case-${cs.id}-title`} className="mt-2 text-2xl font-semibold text-fg md:text-3xl">
                    {cs.title}
                  </h3>
                  <p className="mt-2 text-fg/85">{cs.summary}</p>
                </div>
                {cs.liveLink && (
                  <a href={cs.liveLink} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5">
                    Live app <ArrowUpRight />
                  </a>
                )}
              </header>

              <div className="mt-6">
                <Block label="The problem">{cs.problem}</Block>
              </div>

              <div className="mt-6">
                <Diagram layers={cs.architecture} label={`${cs.title} architecture`} />
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <Block label="Hard decision" title={cs.decision.title}>
                  {cs.decision.body}
                </Block>
                <Block label="What broke & the fix" title={cs.broke.title}>
                  {cs.broke.body}
                </Block>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <h4 className="eyebrow">Result</h4>
                <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {cs.results.map((r) => (
                    <div key={r.label} className="flex flex-col-reverse justify-end rounded-2xl border border-line bg-white/[0.03] p-4">
                      <dt className="mt-1 text-xs text-muted">{r.label}</dt>
                      <dd className="whitespace-nowrap font-display text-2xl font-semibold text-gradient md:text-3xl">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-muted">{cs.resultNote}</p>
                <p className="mt-4 text-sm text-fg/80">
                  {cs.repo.href ? (
                    <a href={cs.repo.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan hover:underline">
                      View the repo <ArrowUpRight className="size-3.5" />
                    </a>
                  ) : (
                    cs.repo.note
                  )}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
