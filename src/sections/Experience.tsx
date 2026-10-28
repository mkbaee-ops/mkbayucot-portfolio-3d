import { Reveal, Section } from '../components/ui'
import { experience } from '../data/profile'

export function Experience() {
  return (
    <Section
      id="experience"
      index="05"
      eyebrow="Experience"
      title={
        <>
          Where I've built, broken, <span className="text-gradient">and rebuilt automations.</span>
        </>
      }
    >
      <ol className="relative border-l border-white/10 pl-6 md:pl-10">
        {experience.map((job, j) => (
          <li key={job.role + job.period} className="relative pb-10 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[31px] top-7 size-3 rounded-full md:-left-[47px] ${
                j === 0 ? 'bg-cyan shadow-[0_0_14px_3px_rgb(34_211_238/0.6)]' : 'border border-white/30 bg-ink-2'
              }`}
            />
            <Reveal className="glass rounded-3xl p-6 md:p-8">
              <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div>
                  <h3 className="text-xl font-semibold text-fg md:text-2xl">{job.role}</h3>
                  <p className="mt-1 text-muted">{job.company}</p>
                </div>
                <p className="rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 font-display text-xs text-cyan">
                  {job.period} · {job.location}
                </p>
              </header>

              {job.summary && <p className="mt-4 max-w-3xl leading-relaxed text-fg/85">{job.summary}</p>}

              {job.metrics && (
                <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {job.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col-reverse justify-end rounded-2xl border border-line bg-white/[0.03] p-4">
                      <dt className="mt-1 text-xs leading-snug text-muted">{m.label}</dt>
                      <dd className="font-display text-2xl font-semibold text-gradient md:text-3xl">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <ul className={`mt-6 grid gap-x-8 gap-y-5 ${job.highlights.length > 3 ? 'md:grid-cols-2' : ''}`}>
                {job.highlights.map((h) => (
                  <li key={h.lead} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gradient-to-br from-cyan to-violet" />
                    <div>
                      <p className="font-display text-sm font-semibold text-fg">{h.lead}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{h.text}</p>
                      {h.href && (
                        <a href={h.href} className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-cyan hover:underline">
                          See it<span className="sr-only">: {h.lead}</span>
                          <span aria-hidden="true">→</span>
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {job.tools && (
                <ul aria-label="Tools used" className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
                  {job.tools.map((t) => (
                    <li key={t} className="rounded-md border border-line bg-white/[0.04] px-2 py-1 text-[11px] text-fg/80">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
