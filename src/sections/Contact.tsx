import type { ReactNode } from 'react'
import { ArrowUpRight, GitHubIcon, PlaceholderBadge, Reveal, Section } from '../components/ui'
import { profile } from '../data/profile'

const { contact } = profile

function Card({ label, value, href, icon }: { label: string; value: ReactNode; href?: string | null; icon: ReactNode }) {
  const body = (
    <>
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wider text-muted">{label}</span>
        <span className="block truncate font-medium text-fg">{value}</span>
      </span>
      {href && <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted" />}
    </>
  )
  const cls = 'glass flex items-center gap-4 rounded-2xl p-4 transition'
  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`${cls} hover:border-cyan/50`}>
      {body}
    </a>
  ) : (
    <div className={`${cls} !border-dashed !border-amber-300/30`}>{body}</div>
  )
}

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export function Contact() {
  return (
    <Section
      id="contact"
      index="06"
      eyebrow="Contact"
      title={
        <>
          Let's automate <span className="text-gradient">something.</span>
        </>
      }
      intro="Tell me what's eating your time. I'll show you how to get it back."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
          <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full bg-cyan/20 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-10 size-64 rounded-full bg-violet/20 blur-3xl" />
          <div className="relative">
            <p className="font-display text-2xl font-semibold text-fg">Have a workflow in mind?</p>
            <p className="mt-2 text-muted">
              Based in {profile.location} and working remotely. I speak {profile.languages.join(' and ')}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={`mailto:${contact.email}`} className="btn-primary">
                Email me
              </a>
              {contact.resume ? (
                <a href={contact.resume} download className="btn-ghost">
                  Download resume
                </a>
              ) : (
                <span className="btn-ghost cursor-not-allowed !border-dashed !border-amber-300/40 opacity-80" aria-disabled="true">
                  Download resume <PlaceholderBadge />
                </span>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <Card label="Email" value={contact.email} href={`mailto:${contact.email}`} icon={icon('M4 6h16v12H4zM4 7l8 6 8-6')} />
            </li>
            <li>
              <Card label="LinkedIn" value="/in/mark-klent-bayucot" href={contact.linkedin} icon={icon('M5 9v10M5 5v.01M10 19v-6a3 3 0 0 1 6 0v6M10 9v10')} />
            </li>
            <li>
              <Card
                label="GitHub"
                value={contact.github ? contact.github.replace('https://', '') : <PlaceholderBadge>Add GitHub URL</PlaceholderBadge>}
                href={contact.github}
                icon={<GitHubIcon className="size-5" />}
              />
            </li>
            <li>
              <Card label="Phone" value={contact.phone} href={contact.phoneHref} icon={icon('M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2')} />
            </li>
            <li className="sm:col-span-2">
              <Card label="OnlineJobs.ph" value="View profile" href={contact.onlinejobs} icon={icon('M4 8h16v11H4zM9 8V5h6v3')} />
            </li>
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
