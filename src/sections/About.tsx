import { profile, services } from '../data/profile'
import { Reveal, Section } from '../components/ui'

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title={
        <>
          Systems thinking, <span className="text-gradient">from webhook to production.</span>
        </>
      }
    >
      <div className="grid items-start gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
        <Reveal className="mx-auto w-full max-w-[320px]">
          <figure className="glass relative overflow-hidden rounded-3xl p-3">
            <div aria-hidden="true" className="absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgb(34_211_238/0.25),transparent_60%)]" />
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <figcaption className="flex items-center justify-between px-2 pb-1 pt-3 text-sm">
              <span className="font-display font-medium text-fg">{profile.location}</span>
              <span className="text-muted">{profile.languages.join(' · ')}</span>
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-lg leading-relaxed text-fg/90">{profile.bio}</p>
            <p className="mt-5 border-l-2 border-violet/60 pl-4 leading-relaxed text-muted">{profile.nowBuilding}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {profile.stats.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4">
                  <dt className="text-xs leading-snug text-muted">{s.label}</dt>
                  <dd className="mt-2 font-display text-3xl font-semibold text-gradient">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-20">
        <h3 className="font-display text-xl font-semibold text-fg">What I build</h3>
        <p className="mt-1 text-muted">End-to-end automation, from the first webhook to the last dashboard.</p>
      </Reveal>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={(i % 3) * 0.06} className="glass group h-full rounded-2xl p-5 transition hover:border-cyan/40">
              <span aria-hidden="true" className="mb-4 block h-px w-10 bg-gradient-to-r from-cyan to-violet transition-all duration-500 group-hover:w-20" />
              <h4 className="font-display text-base font-semibold text-fg">{s.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
