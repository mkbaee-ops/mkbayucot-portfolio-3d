// Personal info. Sourced from https://mkbayucot.lovable.app.
// Anything set to `null` is a PLACEHOLDER: the UI shows it as "add me" until you fill it in.

export const profile = {
  name: 'Mark Klent Bayucot',
  firstName: 'Mark Klent',
  lastName: 'Bayucot',
  title: 'AI Automation Specialist',
  goal: 'working toward AI Engineer',
  location: 'Cebu, Philippines',
  languages: ['English', 'Filipino'],
  photo: '/images/profile.webp',

  tagline:
    'I build AI systems that run real operations: n8n, Zapier & Make automations, plus full-stack web apps shipped with Claude Code, Supabase & Vercel.',

  // Bio, verbatim from the current portfolio
  bio: "I'm an AI Automations Specialist building intelligent workflows that replace manual ops with systems that scale. I design end-to-end automations across GoHighLevel, n8n and Zapier — from lead capture and CRM nurture to AI-powered content pipelines and multi-channel sequences. 30+ live workflows shipped, 99% uptime, and every build documented so clients can self-manage.",

  nowBuilding:
    'Next step: AI Engineer. Alongside automation work I now build landing pages and full-stack web apps with Claude Code, GitHub, Supabase and Vercel, taking the same systems thinking from no-code workflows into production code.',

  stats: [
    { value: '30+', label: 'Live workflows shipped' },
    { value: '99%', label: 'Automation uptime' },
    { value: '20+ hrs', label: 'Manual work removed weekly' },
    { value: '15%', label: 'Avg. lift in click-through & response' },
  ],

  contact: {
    email: 'mkbaee@gmail.com',
    phone: '+63 915 019 2618',
    phoneHref: 'tel:+639150192618',
    linkedin: 'https://www.linkedin.com/in/mark-klent-bayucot-b7ab54419/',
    onlinejobs: 'https://www.onlinejobs.ph/jobseekers/info/3453959',
    github: null as string | null, // PLACEHOLDER: e.g. 'https://github.com/your-username'
    resume: null as string | null, // PLACEHOLDER: drop a PDF in /public and set e.g. '/Mark-Klent-Bayucot-Resume.pdf'
  },
}

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

export const experience = [
  {
    role: 'AI Automations Specialist',
    company: 'Freelance',
    period: '2025 — Present',
    location: 'Remote',
    highlights: [
      'Built and maintained 30+ multi-step Zapier workflows across CRMs, email platforms, and data tools — eliminating 20+ hours/week of manual follow-up.',
      'Designed and connected lead capture funnels to automated Zap sequences, averaging a 15% lift in click-through and response rates.',
      'Integrated platforms including GoHighLevel, Google Sheets, and Airtable using Zapier, webhooks, and custom API steps — replacing fragile manual hand-offs with reliable, real-time data syncs.',
      'Diagnosed and rebuilt broken Zaps, misconfigured triggers, and failed filters — maintaining 99% automation uptime across client stacks.',
      'Documented all workflows with step-by-step Zap maps and trained clients to self-manage, add branches, and troubleshoot independently.',
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
  { name: 'OpenAI', core: true },
  { name: 'Supabase', icon: '/icons/supabase.svg', core: true },
  { name: 'Vercel', icon: '/icons/vercel.svg', core: true },
  { name: 'GitHub', icon: '/icons/github.svg', core: true },
  { name: 'Groq' },
  { name: 'GoHighLevel' },
  { name: 'HubSpot', icon: '/icons/hubspot.svg' },
  { name: 'ActiveCampaign' },
  { name: 'Airtable', icon: '/icons/airtable.svg' },
  { name: 'Google Sheets', icon: '/icons/googlesheets.svg' },
  { name: 'Apps Script', icon: '/icons/googleappsscript.svg' },
  { name: 'Google Calendar', icon: '/icons/googlecalendar.svg' },
  { name: 'Notion', icon: '/icons/notion.svg' },
  { name: 'Slack' },
  { name: 'Gmail', icon: '/icons/gmail.svg' },
  { name: 'REST APIs' },
  { name: 'Webhooks' },
]
