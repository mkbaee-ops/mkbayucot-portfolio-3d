import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      // Slide only: content is never hidden, so nothing looks broken if the animation fires late
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Section({ id, index, eyebrow, title, intro, children, className = '' }: {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 md:py-32 ${className}`}>
      <Reveal className="mb-10 max-w-2xl md:mb-14">
        <p className="eyebrow">
          <span className="text-muted">{index} /</span> {eyebrow}
        </p>
        <h2 id={`${id}-title`} className="mt-3 text-3xl font-semibold text-fg sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{intro}</p>}
      </Reveal>
      {children}
    </section>
  )
}

/** Decorative logo next to its visible name: a background image, so it's invisible to screen readers and alt-text audits. */
export function LogoIcon({ src, className = 'size-4' }: { src: string; className?: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-contain bg-center bg-no-repeat ${className}`} style={{ backgroundImage: `url(${src})` }} />
}

export function PlaceholderBadge({ children = 'Placeholder' }: { children?: ReactNode }) {
  return <span className="placeholder-badge">{children}</span>
}

export function ArrowUpRight({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function GitHubIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}
