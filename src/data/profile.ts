// Personal info. Sourced from https://mkbayucot.lovable.app.
// Contact links set to `null` are hidden.

import { projects } from './projects'

// Counted from projects.ts so the numbers stay true as you add projects (placeholders excluded).
export const counts = {
  automations: projects.filter((p) => p.category === 'automation' && !p.placeholder).length,
  webApps: projects.filter((p) => p.category === 'web' && !p.placeholder).length,
}

export const profile = {
  name: 'Mark Klent Bayucot',
  firstName: 'Mark Klent',
  lastName: 'Bayucot',
  title: 'AI Automation Specialist',
  location: 'Cebu, Philippines',
  languages: ['English', 'Filipino'],
  photo: '/images/profile.webp',

  tagline:
    'I build AI systems that run real operations: n8n, Zapier & Make automations, plus full-stack web apps shipped with Claude Code, Supabase & Vercel.',

  // Bio adapted from the current portfolio
  bio: "I'm an AI Automation Specialist building workflows and apps that replace manual operations with systems that scale. I design end-to-end automations in n8n, Zapier and Make (plus GoHighLevel for CRM work), from lead capture and CRM nurture to AI-powered content pipelines and support triage, and I document every build so clients can run it themselves.",

  nowBuilding:
    'Next step: AI Engineer. Alongside automation work I now build landing pages and full-stack web apps with Claude Code, GitHub, Supabase and Vercel, taking the same systems thinking from no-code workflows into production code.',

  // Only verifiable numbers here; client impact metrics live once, with context, in `experience`.
  stats: [
    { value: String(counts.automations), label: 'Automation projects in this portfolio' },
    { value: String(counts.webApps), label: 'Web apps live in production' },
    { value: '2,339', label: 'Job postings screened in one Lead Engine run' },
  ],

  contact: {
    email: 'mkbaee@gmail.com',
    phone: '+63 915 019 2618',
    phoneHref: 'tel:+639150192618',
    linkedin: 'https://www.linkedin.com/in/mark-klent-bayucot-6a119528b/',
    onlinejobs: 'https://www.onlinejobs.ph/jobseekers/info/3453959',
    github: 'https://github.com/mkbaee-ops' as string | null,
    resume: '/Mark-Klent-Bayucot-Resume.pdf' as string | null, // file lives in /public
  },
}

// Client quotes. The Testimonials section only appears once this has at least one entry.
// Use real, approved quotes only, e.g.
// { quote: 'Mark rebuilt our …', name: 'Jane Doe', role: 'Operations Lead', company: 'LMBP' }
export const testimonials: { quote: string; name: string; role: string; company: string }[] = []

// Services, from the "What I build" section of the current portfolio
export const services = [
  {
    title: 'AI-Powered Workflows',
    body: 'End-to-end automations with OpenAI / Groq routing — sentiment analysis, content generation, smart triage, and decision branches that scale.',
  },
  {
    title: 'Multi-Platform Integrations',
    body: 'Zapier, n8n, and Make.com scenarios that connect your CRM, email, Slack, Sheets, and social tools into one coherent system.',
  },
  {
    title: 'Webhook & API Pipelines',
    body: 'Custom webhook receivers, API enrichment, and data routing — turning raw events into structured actions across any stack.',
  },
  {
    title: 'CRM & Pipeline Automation',
    body: 'Lead scoring, stage advancement, nurture sequences, and follow-up cadences that keep deals moving without manual touches.',
  },
  {
    title: 'Data Sync & Reporting',
    body: 'Real-time sync between Sheets, Airtable, Notion, and databases. Automated dashboards and audit trails your team can trust.',
  },
  {
    title: 'Audit & Optimization',
    body: 'Diagnose broken triggers, fix failing branches, and rebuild workflows for speed, reliability, and easier maintenance.',
  },
]

export type Experience = {
  role: string
  company: string
  period: string
  location: string
  summary?: string
  /** Headline outcomes shown as stat tiles */
  metrics?: { value: string; label: string }[]
  /** `lead` is the bold lead-in; `href` adds a "See it" link (e.g. to a section on this page) */
  highlights: { lead: string; text: string; href?: string }[]
  tools?: string[]
}

// Sourced from the resume and the current portfolio.
export const experience: Experience[] = [
  {
    role: 'AI Automation Specialist & AI App Builder',
    company: 'Freelance',
    period: '2025 — Present',
    location: 'Remote',
    summary:
      'I own client projects end to end, from discovery and process mapping through build, testing, deployment, documentation and training, for marketing agencies, staffing agencies, e-commerce and service businesses.',
    metrics: [
      { value: '20+h', label: 'Manual follow-up removed per week, across client Zapier workflows' },
      { value: '15%', label: 'Avg. lift in click-through & response on rebuilt lead-capture funnels' },
      { value: '99%', label: 'Uptime across the client workflows I monitor and maintain' },
    ],
    highlights: [
      {
        lead: 'AI systems in code',
        text: 'Engineered a lead research engine in Claude Code and Python that finds, researches and scores companies with source-linked evidence, enriching only top-priority leads to cut spend on paid enrichment APIs.',
        href: '#automations',
      },
      {
        lead: 'Full-stack web apps',
        text: 'Ship landing pages and full-stack apps with Claude Code, GitHub, Supabase and Vercel, including a client portal where staffing clients browse talent profiles, shortlist candidates and request interviews.',
        href: '#web',
      },
      {
        lead: 'Automation at scale',
        text: 'Build and maintain multi-step workflows in Zapier, n8n and Make across CRMs, email platforms and data tools, replacing manual follow-up with triggered sequences.',
        href: '#automations',
      },
      {
        lead: 'Integrations & APIs',
        text: 'Connect GoHighLevel, Google Sheets and Airtable through webhooks and custom API steps, replacing fragile manual hand-offs with real-time data sync.',
      },
      {
        lead: 'Funnels that convert',
        text: 'Designed lead capture funnels wired to automated nurture sequences, so every new lead gets a timely, personalized follow-up.',
      },
      {
        lead: 'Reliability & handover',
        text: 'Diagnose and rebuild broken workflows, triggers and filters and monitor them in production, then document every build with step-by-step maps and train clients to self-manage.',
      },
    ],
    tools: ['Claude Code', 'Zapier', 'n8n', 'Make', 'GitHub', 'Supabase', 'Vercel', 'OpenAI', 'Groq', 'GoHighLevel', 'Google Sheets', 'Airtable'],
  },
  {
    role: 'Secretariat Staff',
    company: 'One Stop Shop Secretariat, Mactan-Cebu International Airport Authority',
    period: '2022 — 2024',
    location: 'Cebu, Philippines',
    highlights: [
      {
        lead: 'Operations flow',
        text: 'Coordinated scheduling and document routing for OSS operations, keeping daily office workflow moving without bottlenecks.',
      },
      {
        lead: 'Cross-agency liaison',
        text: 'Primary liaison between the secretariat and multiple on-site government and corporate partner agencies, resolving cross-agency requests.',
      },
      {
        lead: 'Audit-ready records',
        text: 'Prepared meeting minutes, reports and data records to keep operations audit-ready; guided walk-in applicants through requirements, reducing repeat visits.',
      },
    ],
  },
]

// Tech stack. `icon` points to a file in /public/icons (Simple Icons, CC0); omit it to show a monogram.
// `core: true` tools render larger and brighter in the 3D sphere.
export const stack: { name: string; icon?: string; core?: boolean }[] = [
  { name: 'n8n', icon: '/icons/n8n.svg', core: true },
  { name: 'Zapier', icon: '/icons/zapier.svg', core: true },
  { name: 'Make', icon: '/icons/make.svg', core: true },
  { name: 'Claude Code', icon: '/icons/claude.svg', core: true },
  { name: 'OpenAI', icon: '/icons/openai.svg', core: true },
  { name: 'Supabase', icon: '/icons/supabase.svg', core: true },
  { name: 'Vercel', icon: '/icons/vercel.svg', core: true },
  { name: 'GitHub', icon: '/icons/github.svg', core: true },
  { name: 'Groq', icon: '/icons/groq.svg' },
  { name: 'GoHighLevel', icon: '/icons/crm.svg' },
  { name: 'HubSpot', icon: '/icons/hubspot.svg' },
  { name: 'ActiveCampaign', icon: '/icons/crm.svg' },
  { name: 'Airtable', icon: '/icons/airtable.svg' },
  { name: 'Google Sheets', icon: '/icons/googlesheets.svg' },
  { name: 'Apps Script', icon: '/icons/googleappsscript.svg' },
  { name: 'Google Calendar', icon: '/icons/googlecalendar.svg' },
  { name: 'Notion', icon: '/icons/notion.svg' },
  { name: 'Slack', icon: '/icons/slack.svg' },
  { name: 'Gmail', icon: '/icons/gmail.svg' },
  { name: 'REST APIs', icon: '/icons/api.svg' },
  { name: 'Webhooks', icon: '/icons/webhook.svg' },
]
