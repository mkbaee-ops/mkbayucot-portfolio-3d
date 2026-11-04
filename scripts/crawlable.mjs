// Build-time plugin: most AI crawlers don't run JavaScript, so they would see an empty page.
// This writes the portfolio data into index.html as plain HTML and JSON-LD, and emits llms.txt and sitemap.xml.
// Everything comes from src/data, so it stays in sync when you add a project.
import { caseStudies } from '../src/data/caseStudies.ts'
import { counts, experience, profile, services, stack } from '../src/data/profile.ts'
import { projects } from '../src/data/projects.ts'

const ROLES = ['AI Automation Specialist', 'AI Automation Developer', 'Workflow Automation Developer', 'n8n Developer', 'Zapier Specialist', 'Make.com Specialist']
const AVAILABILITY = 'Open to remote roles, including independent contractor work. Can start immediately.'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const real = projects.filter((p) => !p.placeholder)
const skills = stack.map((s) => s.name)
const projectUrl = (site, p) =>
  p.deepDive ? `${site}/#case-${p.deepDive}` : p.caseStudy ? `${site}/#cs-${p.id}` : p.liveLink || `${site}/`
const summary = `${profile.name} is an ${profile.title} based in ${profile.location}, working in automation since 2025. Builds AI-powered workflows in n8n, Zapier and Make, Python automation with Claude Code, and full-stack web apps with Next.js, Supabase and Vercel.`

function staticHtml(site) {
  const project = (p) => `<article><h3>${esc(p.title)}</h3>
<p>${esc(p.description)}</p>
<p>Tools: ${esc(p.tools.join(', '))}</p>
<p><a href="${esc(projectUrl(site, p))}">View project</a>${p.liveLink ? ` · <a href="${esc(p.liveLink)}">Live site</a>` : ''}</p></article>`
  const study = (c) => `<article><h3>${esc(c.title)}</h3>
<p>${esc(c.problem)}</p>
<p><strong>${esc(c.decision.title)}:</strong> ${esc(c.decision.body)}</p>
<p><strong>${esc(c.broke.title)}:</strong> ${esc(c.broke.body)}</p>
<ul>${c.results.map((r) => `<li>${esc(r.value)}: ${esc(r.label)}</li>`).join('')}</ul>
<p>${esc(c.resultNote)}</p></article>`
  const job = (e) => `<article><h3>${esc(e.role)}, ${esc(e.company)}</h3>
<p>${esc(e.period)} · ${esc(e.location)}</p>
${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
<ul>${(e.metrics ?? []).map((m) => `<li>${esc(m.value)}: ${esc(m.label)}</li>`).join('')}${e.highlights.map((h) => `<li><strong>${esc(h.lead)}:</strong> ${esc(h.text)}</li>`).join('')}</ul></article>`
  const { contact: c } = profile
  return `<main id="static-profile">
<h1>${esc(profile.name)}: ${esc(profile.title)}</h1>
<p>${esc(summary)}</p>
<p>${esc(profile.bio)}</p>
<p>${esc(profile.nowBuilding)}</p>
<h2>Availability</h2><p>${esc(AVAILABILITY)}</p>
<h2>Roles</h2><p>${esc(ROLES.join(', '))}</p>
<h2>Skills and tools</h2><p>${esc(skills.join(', '))}</p>
<h2>What I build</h2><ul>${services.map((s) => `<li><strong>${esc(s.title)}:</strong> ${esc(s.body)}</li>`).join('')}</ul>
<h2>Automation projects (${counts.automations})</h2>${real.filter((p) => p.category === 'automation').map(project).join('\n')}
<h2>Web apps (${counts.webApps})</h2>${real.filter((p) => p.category === 'web').map(project).join('\n')}
<h2>Engineering case studies</h2>${caseStudies.map(study).join('\n')}
<h2>Experience</h2>${experience.map(job).join('\n')}
<h2>Contact</h2><ul><li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li><li><a href="${esc(c.linkedin)}">LinkedIn</a></li><li><a href="${esc(c.github)}">GitHub</a></li><li><a href="${esc(c.onlinejobs)}">OnlineJobs.ph</a></li></ul>
</main>`
}

function jsonLd(site, today) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${site}/`,
    dateModified: today,
    mainEntity: {
      '@type': 'Person',
      '@id': `${site}/#person`,
      name: profile.name,
      url: `${site}/`,
      image: `${site}${profile.photo}`,
      jobTitle: profile.title,
      description: `${summary} ${AVAILABILITY}`,
      email: `mailto:${profile.contact.email}`,
      address: { '@type': 'PostalAddress', addressLocality: 'Cebu', addressCountry: 'PH' },
      knowsLanguage: profile.languages,
      knowsAbout: ['AI automation', 'Workflow automation', 'Lead generation automation', 'CRM automation', 'LLM integration', 'API integration', ...skills],
      hasOccupation: { '@type': 'Occupation', name: profile.title, alternateName: ROLES.slice(1), skills: skills.join(', ') },
      sameAs: [profile.contact.linkedin, profile.contact.github, profile.contact.onlinejobs, 'https://mkbayucot.lovable.app'],
    },
    hasPart: real.map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      description: p.description,
      url: projectUrl(site, p),
      keywords: p.tools.join(', '),
      creator: { '@id': `${site}/#person` },
    })),
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function llmsTxt(site) {
  const line = (p) => `- [${p.title}](${projectUrl(site, p)}): ${p.description} Tools: ${p.tools.join(', ')}.`
  const { contact: c } = profile
  return `# ${profile.name}

> ${summary}

- Location: ${profile.location} (remote)
- Roles: ${ROLES.join(', ')}
- Availability: ${AVAILABILITY}
- Languages: ${profile.languages.join(', ')}
- Skills and tools: ${skills.join(', ')}

## Automation projects

${real.filter((p) => p.category === 'automation').map(line).join('\n')}

## Web apps

${real.filter((p) => p.category === 'web').map(line).join('\n')}

## Engineering case studies

${caseStudies.map((s) => `- [${s.title}](${site}/#case-${s.id}): ${s.summary} Results: ${s.results.map((r) => `${r.value} ${r.label}`).join('; ')}. ${s.resultNote}`).join('\n')}

## Experience

${experience.map((e) => `- ${e.role}, ${e.company} (${e.period})`).join('\n')}

## Contact

- Email: ${c.email}
- LinkedIn: ${c.linkedin}
- GitHub: ${c.github}
- OnlineJobs.ph: ${c.onlinejobs}
- Portfolio: ${site}/
`
}

export function crawlable(site) {
  const today = new Date().toISOString().slice(0, 10)
  return {
    name: 'crawlable',
    apply: 'build',
    transformIndexHtml: (html) =>
      html
        .replace('<div id="root"></div>', () => `<div id="root">${staticHtml(site)}</div>`)
        .replace('</head>', () => `<script type="application/ld+json">${jsonLd(site, today)}</script></head>`),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt(site) })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
      })
    },
  }
}
