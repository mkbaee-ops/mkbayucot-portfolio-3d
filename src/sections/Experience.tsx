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
        {experience.map((job) => (
          <li key={job.role + job.period} className="relative pb-4">
            <span aria-hidden="true" className="absolute -left-[31px] top-2 size-3 rounded-full bg-cyan shadow-[0_0_14px_3px_rgb(34_211_238/0.6)] md:-left-[47px]" />
            <Reveal className="glass rounded-3xl p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-xl font-semibold text-fg md:text-2xl">
                  {job.role} <span className="text-muted">· {job.company}</span>
                </h3>
                <p className="font-display text-sm text-cyan">
                  {job.period} · {job.location}
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3 leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-violet" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
