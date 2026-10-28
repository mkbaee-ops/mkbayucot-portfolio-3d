import { Reveal } from '../components/ui'
import { testimonials } from '../data/profile'

/** Renders nothing until profile.ts has at least one real, approved quote. */
export function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <section aria-label="What clients say" className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
      <ul className={`grid gap-4 ${testimonials.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {testimonials.map((t) => (
          <li key={t.name}>
            <Reveal className="glass h-full rounded-3xl p-6 md:p-8">
              <figure>
                <blockquote className="font-display text-lg leading-relaxed text-fg md:text-xl">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted">
                  <span className="font-semibold text-fg">{t.name}</span> · {t.role}, {t.company}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
