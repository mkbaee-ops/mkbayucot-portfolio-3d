import { motion } from 'framer-motion'
import { counts, profile } from '../data/profile'

const proof = [`${counts.automations} automation projects`, `${counts.webApps} apps live in production`, '2 engineering case studies']

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center">
      {/* Keeps the copy readable over the 3D network on every screen size */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent lg:via-ink/40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <motion.p {...fade(0)} className="eyebrow inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1.5 !text-[10px] !tracking-[0.14em] sm:!text-xs sm:!tracking-[0.22em]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-cyan shadow-[0_0_10px_2px_rgb(34_211_238/0.8)]" />
            {profile.title} · Cebu, PH
          </motion.p>

          {/* Not faded in: this is the LCP element, so it paints immediately */}
          <h1 id="hero-title" className="mt-6 text-5xl font-bold leading-[1.02] text-fg [text-shadow:0_2px_30px_rgb(5_6_10/0.8)] sm:text-6xl lg:text-7xl">
            {profile.firstName}
            <br />
            <span className="text-gradient">{profile.lastName}</span>
          </h1>

          <motion.p {...fade(0.1)} className="mt-5 max-w-xl font-display text-lg font-medium text-fg/90 sm:text-xl">
            I build real AI systems.{' '}
            <span className="text-muted">Automations and full-stack apps, shipped to production for real clients.</span>
          </motion.p>

          <motion.p {...fade(0.18)} className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </motion.p>

          <motion.div {...fade(0.26)} className="mt-8 flex flex-wrap gap-3">
            <a href="#automations" className="btn-primary">
              View Projects
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#contact" className="btn-ghost">
              Contact Me
            </a>
          </motion.div>

          <motion.ul {...fade(0.34)} aria-label="Highlights" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {proof.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1 rounded-full bg-violet" />
                {p}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <a href="#about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted transition hover:text-fg sm:flex">
        Scroll
        <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="packet absolute left-0 h-3 w-px bg-cyan" />
        </span>
      </a>
    </section>
  )
}
