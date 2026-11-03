// ─────────────────────────────────────────────────────────────────────────────
// All projects live here. Add a new object to `projects` and it appears on the
// site automatically: automations go to the 3D workflow showcase, web projects
// go to the device-mockup cards. No component changes needed.
//
// Source: https://mkbayucot.lovable.app and its case-study pages.
// ─────────────────────────────────────────────────────────────────────────────

/** Drives the node color/shape in the workflow scene. */
export type StepKind = 'trigger' | 'logic' | 'ai' | 'router' | 'data' | 'action' | 'notify' | 'schedule'

export type WorkflowStep = {
  /** Short node label (keep it under ~18 characters). */
  label: string
  kind: StepKind
  /** Shown when a visitor clicks the node. */
  detail: string
  /** Optional fan-out branches drawn as small satellite nodes (e.g. router paths). */
  branches?: string[]
}

export type Project = {
  id: string
  title: string
  category: 'automation' | 'web'
  /** Automation platform, or a short label for web projects. */
  platform?: 'Zapier' | 'n8n' | 'Make.com' | string
  description: string
  tools: string[]
  /** Workflow steps, in run order (automations only). */
  steps?: WorkflowStep[]
  /** Headline numbers shown beside the workflow. */
  stats?: { value: string; label: string }[]
  /** Path under /public, e.g. '/images/projects/my-app.webp' */
  image?: string
  imageAlt?: string
  liveLink?: string | null
  githubLink?: string | null
  caseStudyLink?: string | null
  /** On-site case study, opened from the project panel */
  caseStudy?: {
    howItWorks: { stage: string; title: string; body: string }[]
    proof: { image: string; alt: string; title: string; caption: string; points?: string[] }[]
  }
  /** id of an engineering case study in caseStudies.ts (adds a "Read the engineering case study" link) */
  deepDive?: string
  /** Shown as plain text when there's no public repo, e.g. 'Private client repo' */
  repoNote?: string
  /** true = template slot, excluded from counts. */
  placeholder?: boolean
}

export const projects: Project[] = [
  // ───────────────────────────── Automations ─────────────────────────────
  {
    id: 'lmbp-lead-research',
    title: 'AI Lead Research Engine',
    category: 'automation',
    platform: 'Claude Code',
    description:
      'A code-first lead research pipeline for LMBP, built in Claude Code with Python and Scrapling. Type one request in chat and a full run finds companies hiring support staff, researches them, scores each A/B/C with source-linked evidence, enriches the best leads, and logs them to Google Sheets. Research only: no outreach.',
    tools: ['Claude Code', 'Python', 'Scrapling', 'JSearch API', 'Prospeo', 'Apollo API', 'Google Sheets'],
    stats: [
      { value: '13', label: 'Job-data sources' },
      { value: 'A/B/C', label: 'Evidence-based priority' },
      { value: '0', label: 'Guessed emails' },
    ],
    steps: [
      { label: 'Chat request', kind: 'trigger', detail: 'A lead request is typed in chat, e.g. "find 30 SaaS companies hiring customer support in Germany". One message is one full run.' },
      { label: 'Claude Code', kind: 'ai', detail: 'Claude Code translates the request into a pipeline run (query, industry, location, limit) and reports the result summary back in chat.' },
      { label: 'Job sources', kind: 'action', detail: 'Pulls postings from licensed APIs and feeds only. Boards whose terms forbid scraping (LinkedIn, Indeed, Glassdoor…) are never scraped.', branches: ['JSearch', 'Remotive', 'Remote OK', 'ATS boards'] },
      { label: 'Group by company', kind: 'logic', detail: 'A job posting is a signal, not a lead. Postings are grouped by company, counting open support roles, how recent they are, and re-posts.' },
      { label: 'Level 1 check', kind: 'logic', detail: 'Company fit, communication relevance and visible hiring. Clearly irrelevant companies go to a skip list and are not re-checked for a set period.' },
      { label: 'Level 2 research', kind: 'data', detail: 'Scrapling reads the company’s own site for support channels, career page and growth news. robots.txt is checked first, with no anti-bot bypass.' },
      { label: 'Score & priority', kind: 'router', detail: 'A 0–100 rubric. Priority A needs a score of 70+ and two independent signal categories. Every signal is a concrete fact with a source URL.', branches: ['A', 'B', 'C', 'Partner'] },
      { label: 'Enrich A leads', kind: 'data', detail: 'Priority A leads get a public business email or decision-maker via official APIs (Prospeo, Apollo). An email is never guessed.' },
      { label: 'Log to Sheets', kind: 'data', detail: 'Rows are de-duplicated by company name, domain and LinkedIn page; matches are updated, never duplicated. Each run also saves an Excel copy.' },
      { label: 'Funnel report', kind: 'notify', detail: 'Prints a funnel summary: leads found, qualified A/B/C, emails found, rows logged, duplicates updated and pages that failed to load.' },
    ],
    liveLink: null,
    githubLink: null,
    repoNote: 'Private client repo',
    deepDive: 'lead-engine',
  },
  {
    id: 'client-onboarding',
    title: 'Client Onboarding Pipeline',
    category: 'automation',
    platform: 'Zapier',
    description:
      'Fires the moment a new client submits a form: creates a Drive folder, logs to Sheets, builds a Trello card, sends a personalized welcome email, and alerts the team in Slack. Zero manual steps.',
    tools: ['Zapier', 'Typeform', 'Google Drive', 'Google Sheets', 'Trello', 'Gmail', 'Slack'],
    stats: [
      { value: '22', label: 'Zap steps' },
      { value: '4', label: 'Parallel paths' },
      { value: '0', label: 'Manual steps' },
    ],
    steps: [
      { label: 'Typeform', kind: 'trigger', detail: 'A client completes the intake form. The Zap fires instantly — no waiting, no polling delay.' },
      { label: 'Filter', kind: 'logic', detail: 'Filter by Zapier checks conditions so only qualified submissions proceed.' },
      { label: 'Date formatter', kind: 'logic', detail: 'A date formatter standardizes the start date field for every downstream step.' },
      { label: 'Drive folder', kind: 'data', detail: 'A named project folder is created in Google Drive, and its link is passed to later steps.' },
      { label: 'Sheets row', kind: 'data', detail: 'A structured row is appended to the onboarding tracker: Timestamp, Client Name, Email, Service, Start Date, Drive Folder Link, and Status set to "Onboarding".' },
      { label: 'Paths split', kind: 'router', detail: 'Paths by Zapier routes each submission by tier into one of four paths, each independently running Trello, Gmail, and Slack steps.', branches: ['Path A', 'Path B', 'Path C', 'Path D'] },
      { label: 'Trello card', kind: 'action', detail: 'A card is created in the "New Clients" column of the Client Onboarding board, ready to move through the pipeline stages.' },
      { label: 'Welcome email', kind: 'notify', detail: 'A personalized Gmail welcome with project details, a direct link to the client’s Drive folder, and a 4-step next-steps checklist.' },
      { label: 'Slack alert', kind: 'notify', detail: 'A structured alert lands in #client-onboarding with the client details, the Drive folder link, and a prompt to assign a team member and schedule kick-off.' },
    ],
    image: '/images/projects/client-onboarding.webp',
    imageAlt: 'Zapier editor showing the 22-step Client Onboarding Zap with four path branches',
    caseStudy: {
      howItWorks: [
        {
          stage: "Trigger",
          title: "New Typeform entry",
          body: "A client completes the intake form. The Zap fires instantly — no waiting, no polling delay.",
        },
        {
          stage: "Filter + Format",
          title: "Validate & clean",
          body: "Filter by Zapier checks conditions so only qualified submissions proceed. A date formatter standardizes the start date field.",
        },
        {
          stage: "Storage",
          title: "Drive folder + Sheets log",
          body: "A named project folder is created in Google Drive. A structured row is appended to the onboarding tracker spreadsheet.",
        },
        {
          stage: "Delivery",
          title: "3 outputs in parallel",
          body: "Paths by Zapier routes to Trello (project card), Gmail (welcome email), and Slack (team alert).",
        },
      ],
      proof: [
        {
          image: "/images/projects/client-onboarding.webp",
          alt: "Zapier run history of the 22-step Client Onboarding Zap with four path branches",
          title: "22-step Zapier workflow, successfully executed",
          caption: "Typeform trigger, Filter by Zapier, Formatter (Date/Time), Google Drive folder, Google Sheets row, and a 4-way Paths split, each path running Trello, Gmail and Slack steps.",
          points: ["Steps 1–6: Trigger → Filter → Format → Drive → Sheets → Split", "Paths A–C: condition rules (did not run, tier filter)", "Path D: all 3 outputs fired successfully"],
        },
        {
          image: "/images/projects/onboarding-sheets.webp",
          alt: "Google Sheets onboarding tracker with timestamp, client name, email, service, start date, Drive link and status columns",
          title: "Live spreadsheet tracker",
          caption: "Every submission auto-populates a structured row with a status of \"Onboarding\". The Drive folder link comes from the previous step’s output.",
        },
        {
          image: "/images/projects/onboarding-email.webp",
          alt: "Personalized welcome email in Gmail listing project details and next steps",
          title: "Personalized welcome email via Gmail",
          caption: "Sent automatically with the project details, a direct link to the client’s Drive folder, and a 4-step next-steps checklist.",
        },
        {
          image: "/images/projects/onboarding-trello.webp",
          alt: "Trello board with columns New Clients, In Progress, Kick-off Scheduled, Onboarded and On Hold",
          title: "Trello card in \"New Clients\"",
          caption: "The card lands on the Client Onboarding board, ready to move through New Clients → In Progress → Kick-off Scheduled → Onboarded.",
        },
        {
          image: "/images/projects/onboarding-slack.webp",
          alt: "Slack message in #client-onboarding with client name, company, budget, start date and Drive folder link",
          title: "Structured Slack alert",
          caption: "The team is notified in #client-onboarding with the client details, Drive folder link and an action prompt to assign a team member and schedule kick-off.",
        },
      ],
    },
  },
  {
    id: 'social-media-calendar',
    title: 'Social Media Content Calendar',
    category: 'automation',
    platform: 'Zapier',
    description:
      'When a post is approved in Google Sheets, it auto-generates platform-specific AI captions, spins up a Trello design task, briefs the creator on Gmail, alerts the team on Slack, and sends a 24-hour reminder before going live.',
    tools: ['Zapier', 'AI by Zapier', 'Google Sheets', 'Trello', 'Gmail', 'Slack'],
    stats: [
      { value: '28', label: 'Zap steps' },
      { value: '3', label: 'Platforms' },
      { value: '24h', label: 'Pre-live reminder' },
    ],
    steps: [
      { label: 'Sheets trigger', kind: 'trigger', detail: 'A new approved post in the content calendar fires the Zap — no polling delay, no manual push.' },
      { label: 'Filter', kind: 'logic', detail: 'Only "approved" rows proceed.' },
      { label: 'Formatter', kind: 'logic', detail: 'Formatter normalizes the publish date/time for downstream steps.' },
      { label: 'Paths split', kind: 'router', detail: 'Paths by Zapier routes the post into one of three platform-specific tracks.', branches: ['LinkedIn', 'Instagram', 'X'] },
      { label: 'AI caption', kind: 'ai', detail: 'AI by Zapier generates a tone-matched caption sized for each channel’s best-practice format.' },
      { label: 'Trello task', kind: 'action', detail: 'A Trello card is created for the designer.' },
      { label: 'Gmail brief', kind: 'notify', detail: 'The creator gets a Gmail brief for the post.' },
      { label: 'Slack alert', kind: 'notify', detail: 'The team is pinged on Slack.' },
      { label: 'Delay 24h', kind: 'schedule', detail: 'Delay by Zapier holds the next step until 24 hours before publish.' },
      { label: 'Slack reminder', kind: 'notify', detail: 'A second Slack message goes out as a pre-live reminder, so nothing slips.' },
    ],
    image: '/images/projects/social-media-calendar.webp',
    imageAlt: 'Zapier editor showing the Social Media Content Calendar workflow',
    caseStudy: {
      howItWorks: [
        {
          stage: "Trigger",
          title: "New Sheets row",
          body: "A new approved post in the content calendar fires the Zap — no polling delay, no manual push.",
        },
        {
          stage: "Filter + Format",
          title: "Validate & schedule",
          body: "Only \"approved\" rows proceed. Formatter normalizes the publish date/time for downstream steps.",
        },
        {
          stage: "Paths",
          title: "3 platform splits",
          body: "Paths by Zapier routes the post into one of three platform-specific tracks (LinkedIn, Instagram, X).",
        },
        {
          stage: "AI",
          title: "Caption per platform",
          body: "AI by Zapier generates a tone-matched caption sized for each channel’s best-practice format.",
        },
        {
          stage: "Delivery",
          title: "Trello + Gmail + Slack",
          body: "A Trello card is created for the designer, the creator gets a Gmail brief, and the team is pinged on Slack.",
        },
        {
          stage: "Reminder",
          title: "24h pre-live ping",
          body: "Delay by Zapier holds the second Slack message until 24 hours before publish — nothing slips.",
        },
      ],
      proof: [
        {
          image: "/images/projects/social-media-calendar.webp",
          alt: "Zapier editor showing the 28-step Social Media Content Calendar workflow",
          title: "28-step Zapier + AI workflow",
          caption: "Multi-path content automation: Sheets trigger, Filter, Formatter, 3-way Paths split, AI captions per platform, Trello task, Gmail, Slack, 24h delay and a pre-live reminder.",
          points: ["Steps 1–4: Trigger → Filter → Format → Paths split", "Each path: AI caption → Trello → Gmail → Slack → Delay → Slack reminder", "3 parallel platform tracks, zero manual handoffs"],
        },
      ],
    },
  },
  {
    id: 'crm-sales-pipeline',
    title: 'CRM & Sales Pipeline',
    category: 'automation',
    platform: 'Zapier',
    description:
      'When a lead submits an inquiry, AI scores them Hot / Warm / Cold, logs them to a CRM tracker, creates a Trello deal card, fires a personalized email sequence, and notifies sales on Slack, with automatic follow-ups based on lead score.',
    tools: ['Zapier', 'AI by Zapier', 'Typeform', 'Google Sheets', 'Trello', 'Gmail', 'Slack'],
    stats: [
      { value: '3', label: 'Connected Zaps' },
      { value: '44', label: 'Total steps' },
      { value: '0', label: 'Manual handoffs' },
    ],
    steps: [
      { label: 'Typeform intake', kind: 'trigger', detail: 'Zap 1 (Lead Intake, 8 steps) starts when a lead submits the Typeform inquiry.' },
      { label: 'Filter', kind: 'logic', detail: 'The entry is filtered, then date and text formatters clean the fields before scoring.' },
      { label: 'AI lead score', kind: 'ai', detail: 'AI by Zapier scores each lead Hot, Warm, or Cold.', branches: ['Hot', 'Warm', 'Cold'] },
      { label: 'Sheets CRM', kind: 'data', detail: 'The scored lead is written as a new row in the Google Sheets CRM tracker.' },
      { label: 'Trello deal', kind: 'action', detail: 'The lead is pushed to Trello as a deal card.' },
      { label: 'Outreach email', kind: 'notify', detail: 'Zap 2 (21 steps): a new CRM row triggers a 3-path split by score. Each path runs Gmail → Slack → Delay → Gmail → Slack, a personalized cadence per tier.' },
      { label: 'Slack sales alert', kind: 'notify', detail: 'Reps are pinged on Slack at each stage, so reps and prospects stay in lockstep.' },
      { label: 'Delay by score', kind: 'schedule', detail: 'Delays between touches are set per lead tier.' },
      { label: 'Nurture follow-up', kind: 'notify', detail: 'Zap 3 (15 steps) catches anyone who didn’t convert: three nurture paths with nested conditions, delays, Gmail follow-ups, and Slack pings keep the pipeline alive.' },
    ],
    image: '/images/projects/crm-outreach.webp',
    imageAlt: 'Zapier editor showing the CRM outreach sequence Zap with three lead-score paths',
    caseStudy: {
      howItWorks: [
        {
          stage: "Zap 1 · 8 steps",
          title: "Lead intake",
          body: "Typeform → Filter → Formatter (Date) → Formatter (Text) → AI by Zapier (Hot / Warm / Cold) → Formatter (Utilities) → Google Sheets row → Trello card.",
        },
        {
          stage: "Zap 2 · 21 steps",
          title: "Outreach sequence",
          body: "Sheets trigger → Filter → 3-way Paths split by lead score → each path: Gmail → Slack → Delay → Gmail → Slack. A personalized cadence per tier.",
        },
        {
          stage: "Zap 3 · 15 steps",
          title: "Nurture follow-up",
          body: "Sheets trigger → Filter → 3-way Paths → each path: nested Paths → Delay → Gmail → Slack. Re-engages leads that didn’t convert in the outreach pass.",
        },
      ],
      proof: [
        {
          image: "/images/projects/crm-lead-intake.webp",
          alt: "Zapier editor showing the 8-step Lead Intake Zap",
          title: "Zap 1 — Lead Intake (8 steps)",
          caption: "The Typeform entry is filtered, formatted, scored by AI, then written to the Google Sheets CRM and pushed to Trello as a deal card.",
        },
        {
          image: "/images/projects/crm-outreach.webp",
          alt: "Zapier editor showing the 21-step Outreach Sequence Zap with three score paths",
          title: "Zap 2 — Outreach Sequence (21 steps)",
          caption: "A new CRM row triggers a 3-path outreach split (Hot / Warm / Cold). Each path runs Gmail → Slack → Delay → Gmail → Slack so reps and prospects stay in lockstep.",
        },
        {
          image: "/images/projects/crm-nurture.webp",
          alt: "Zapier editor showing the 15-step Nurture Email Zap with nested paths",
          title: "Zap 3 — Nurture Email (15 steps)",
          caption: "Catches anyone who didn’t convert. Three nurture paths with nested conditions, delays, Gmail follow-ups and Slack pings keep the pipeline alive.",
        },
      ],
    },
  },
  {
    id: 'job-poster-enrichment',
    title: 'Job Poster Scraping & Enrichment',
    category: 'automation',
    platform: 'n8n',
    description:
      'A staffing-agency lead engine. A recruiter types a query in Slack; the workflow validates it with AI, scrapes live job listings, de-duplicates them, enriches each hiring company with decision-maker contacts, logs to Sheets, and drafts a tailored outreach email.',
    tools: ['n8n', 'Groq AI', 'Slack', 'JSearch API', 'Prospeo', 'Google Sheets', 'Gmail', 'JavaScript'],
    stats: [
      { value: '25+', label: 'Workflow nodes' },
      { value: '4', label: 'Sheet log branches' },
      { value: '0', label: 'Manual prospecting hours' },
    ],
    steps: [
      { label: 'Slack query', kind: 'trigger', detail: 'A recruiter posts a role and location in Slack. The Slack Trigger node picks up the message and starts the run — no dashboard, no spreadsheet to open.' },
      { label: 'AI validate', kind: 'ai', detail: 'Groq AI inspects the query for a usable job title and location. Vague requests short-circuit into an "Invalid Query" Slack reply asking for a cleaner search.' },
      { label: 'Scrape jobs', kind: 'action', detail: 'An HTTP node calls the JSearch API and pulls live postings.' },
      { label: 'Split · Dedupe', kind: 'logic', detail: 'Postings are split into items, limited to a working batch size, de-duplicated against previous runs, and normalized by a JavaScript node into one shared schema.' },
      { label: 'Enrich contacts', kind: 'data', detail: 'Each employer goes through Prospeo enrichment calls to resolve the hiring contact and a verified email. Success and error paths are handled separately so one bad record never kills the run.' },
      { label: 'AI outreach', kind: 'ai', detail: 'A Groq AI node drafts a personalized pitch referencing the exact role, company, and location; a Code node formats subject and body.' },
      { label: 'Log to Sheets', kind: 'data', detail: 'Enriched leads, un-enriched leads, skipped duplicates, and failures each append to their own Google Sheet tab — a live prospecting CRM with a full audit trail.', branches: ['Enriched', 'Un-enriched', 'Skipped', 'Failed'] },
      { label: 'Gmail draft', kind: 'notify', detail: 'The message is saved as a Gmail draft for a human to approve and send.' },
      { label: 'Slack recap', kind: 'notify', detail: 'Slack gets a summary so the team sees new job-poster leads in real time.' },
    ],
    image: '/images/projects/n8n-job-poster-enrichment.webp',
    imageAlt: 'n8n canvas showing the Job Poster Scraping & Enrichment workflow',
    caseStudy: {
      howItWorks: [
        {
          stage: "Trigger",
          title: "Slack search request",
          body: "A recruiter posts a role and location in Slack. The Slack Trigger node picks up the message and starts the run.",
        },
        {
          stage: "Validate",
          title: "AI query check",
          body: "Groq AI inspects the query for a usable job title and location. Vague requests short-circuit into an \"Invalid Query\" Slack reply.",
        },
        {
          stage: "Scrape",
          title: "Get all jobs via JSearch",
          body: "An HTTP node calls the JSearch API; postings are split into items, limited to a working batch size, and de-duplicated against previous runs.",
        },
        {
          stage: "Normalize",
          title: "Code node clean-up",
          body: "A JavaScript node standardizes company names, titles, locations and apply links so every branch shares one schema.",
        },
        {
          stage: "Enrich",
          title: "Decision-maker lookup",
          body: "Each employer goes through Prospeo enrichment to resolve the hiring contact and a verified email. Success and error paths are handled separately.",
        },
        {
          stage: "Log",
          title: "Four Sheets branches",
          body: "Enriched leads, un-enriched leads, skipped duplicates and failures each append to their own tab — a live prospecting CRM with a full audit trail.",
        },
        {
          stage: "Write",
          title: "AI outreach email",
          body: "A Groq AI node drafts a personalized pitch referencing the exact role, company and location.",
        },
        {
          stage: "Deliver",
          title: "Gmail draft + Slack recap",
          body: "The message is saved as a Gmail draft for a human to approve, and Slack gets a summary of the new leads.",
        },
      ],
      proof: [
        {
          image: "/images/projects/n8n-job-poster-enrichment.webp",
          alt: "n8n canvas showing the Job Poster Scraping & Enrichment workflow",
          title: "n8n workflow — full build",
          caption: "Slack intake, AI query validation, JSearch scraping, de-duplication, Prospeo enrichment, four Google Sheets branches, AI-written outreach, Gmail draft and Slack notification.",
          points: ["Slack Trigger → Check Query (Groq) → If valid, else \"Invalid Query\" reply", "Get All Jobs (JSearch) → Split Out → Limit → Remove Duplicates → Code", "Prospeo enrichment → If → Append row (success / fallback / skipped)", "AI outreach (Groq) → Code → Gmail draft → Slack message"],
        },
      ],
    },
  },
  {
    id: 'ai-customer-support',
    title: 'AI Customer Support Chatbot',
    category: 'automation',
    platform: 'n8n',
    description:
      'Handles incoming support tickets end-to-end on Groq AI: classifies the issue, looks up the knowledge base, generates a personalized reply, logs to Sheets, emails the customer, notifies Slack, and escalates complaints immediately.',
    tools: ['n8n', 'Groq AI', 'Google Sheets', 'Slack', 'Gmail', 'Webhook'],
    stats: [
      { value: '15+', label: 'Workflow nodes' },
      { value: '6', label: 'AI response branches' },
      { value: '100%', label: 'Free AI via Groq' },
    ],
    steps: [
      { label: 'Webhook ticket', kind: 'trigger', detail: 'A webhook receives the ticket from any source — form, email, or chat — and immediately responds to acknowledge receipt.' },
      { label: 'AI classify', kind: 'ai', detail: 'Groq AI reads the ticket and classifies it as Billing, Technical, Shipping, Refunds, Complaint, or General.' },
      { label: 'KB lookup', kind: 'data', detail: 'The workflow queries an internal knowledge base for the most relevant answer or policy doc before composing a response.' },
      { label: 'Switch route', kind: 'router', detail: 'A Switch node sends each ticket down the branch for its AI-detected category — complaints get escalated instantly.', branches: ['Billing', 'Technical', 'Shipping', 'Refunds', 'Complaint', 'General'] },
      { label: 'AI response', kind: 'ai', detail: 'Each branch runs its own Groq AI node to craft a context-aware, empathetic reply using the KB answer and customer details.' },
      { label: 'Log to Sheets', kind: 'data', detail: 'A JavaScript Code node shapes the record, then the ticket is appended/updated in Google Sheets.' },
      { label: 'Email reply', kind: 'notify', detail: 'The AI response is sent to the customer via email.' },
      { label: 'Slack alert', kind: 'notify', detail: 'The team is pinged on Slack; the Complaint branch fires a dedicated escalation message.' },
    ],
    image: '/images/projects/n8n-ai-customer-support.webp',
    imageAlt: 'n8n canvas showing the AI Customer Support workflow with a six-branch switch',
    caseStudy: {
      howItWorks: [
        {
          stage: "Ingest",
          title: "Webhook ticket receipt",
          body: "A webhook receives the ticket from any source — form, email or chat — and immediately responds to acknowledge receipt.",
        },
        {
          stage: "Classify",
          title: "AI category detection",
          body: "Groq AI classifies the ticket as Billing, Technical, Shipping, Refunds, Complaint or General.",
        },
        {
          stage: "Lookup",
          title: "Knowledge base search",
          body: "The workflow queries an internal knowledge base for the most relevant answer or policy before composing a response.",
        },
        {
          stage: "Route",
          title: "Smart branch routing",
          body: "A Switch node sends each ticket down the branch for its category — complaints get escalated instantly.",
        },
        {
          stage: "Respond",
          title: "Personalized AI reply",
          body: "Each branch runs its own Groq AI node to craft a context-aware, empathetic response using the KB answer and customer details.",
        },
        {
          stage: "Deliver",
          title: "Log, email & notify",
          body: "Appends the ticket to Google Sheets, emails the response, and pings the team on Slack. Complaints trigger an instant escalation.",
        },
      ],
      proof: [
        {
          image: "/images/projects/n8n-ai-customer-support.webp",
          alt: "n8n canvas showing the AI Customer Support workflow with a six-branch switch",
          title: "n8n workflow — full build",
          caption: "Ingestion, AI classification, KB lookup, multi-branch routing, personalized responses, logging, email delivery, Slack notifications and complaint escalation, on free Groq AI.",
          points: ["Webhook → Respond to Webhook → AI Classify (Groq) → Extract Category", "KB Lookup → Switch with 6 branches → branch-specific AI Response nodes", "Code node → Append/update Google Sheet → Send email → Slack alert", "Complaint branch triggers a dedicated escalation message"],
        },
      ],
    },
  },
  {
    id: 'ai-job-scraper',
    title: 'AI Job Scraper + Resume Optimizer',
    category: 'automation',
    platform: 'n8n',
    description:
      'Scrapes live listings via the JSearch API, scores each role against a master resume with AI, rewrites the resume to match the job, saves it to Google Drive, and posts a Slack summary with the match score — no manual input.',
    tools: ['n8n', 'JSearch API', 'OpenAI', 'Google Drive', 'Slack'],
    stats: [
      { value: '15+', label: 'Workflow nodes' },
      { value: '4', label: 'Tools integrated' },
      { value: '0', label: 'Manual input' },
    ],
    steps: [
      { label: 'Schedule', kind: 'schedule', detail: 'A cron-scheduled trigger fires the workflow automatically — no manual start, no polling delay.' },
      { label: 'JSearch API', kind: 'action', detail: 'Fetches live job listings from LinkedIn and Indeed via the JSearch API with a targeted query.' },
      { label: 'Check results', kind: 'logic', detail: 'Validates the API response. An invalid-query branch handles edge cases without breaking the flow.' },
      { label: 'Split out', kind: 'logic', detail: 'Splits each listing into its own item for individual processing.' },
      { label: 'Get resume', kind: 'data', detail: 'Retrieves the master resume from Google Drive as the foundation for tailoring.' },
      { label: 'AI rewrite', kind: 'ai', detail: 'An AI node scores the job against the resume, then rewrites a role-specific version optimized for that job’s keywords and requirements.' },
      { label: 'Save to Drive', kind: 'data', detail: 'The tailored resume is saved to Google Drive.' },
      { label: 'Slack alert', kind: 'notify', detail: 'A Slack notification with job title, company, match score, and a direct resume link.' },
    ],
    image: '/images/projects/n8n-job-scraper.webp',
    imageAlt: 'n8n canvas showing the AI Job Scraper and Resume Optimizer workflow',
    caseStudy: {
      howItWorks: [
        {
          stage: "Trigger",
          title: "Scheduled job pull",
          body: "A cron-scheduled trigger fires the workflow automatically — no manual start.",
        },
        {
          stage: "Search",
          title: "JSearch API scrape",
          body: "Fetches live job listings from LinkedIn and Indeed via the JSearch API with a targeted query.",
        },
        {
          stage: "Validate",
          title: "Check & split results",
          body: "Validates the API response, then splits each listing into its own item.",
        },
        {
          stage: "Read",
          title: "Pull base resume",
          body: "Retrieves the master resume from Google Drive as the foundation for tailoring.",
        },
        {
          stage: "AI",
          title: "Compare & rewrite",
          body: "The AI node scores the job against the resume, then rewrites a role-specific version for that job’s keywords and requirements.",
        },
        {
          stage: "Deliver",
          title: "Drive + Slack",
          body: "Saves the tailored resume to Google Drive and sends a Slack alert with job title, company, match score and resume link.",
        },
      ],
      proof: [
        {
          image: "/images/projects/n8n-job-scraper.webp",
          alt: "n8n canvas showing the AI Job Scraper and Resume Optimizer workflow",
          title: "n8n workflow — full build",
          caption: "Job scraping, AI resume tailoring, cloud storage and notifications. Every node is wired, configured and tested.",
          points: ["Scheduled trigger → JSearch API → result validation → item split", "Per-job loop: resume fetch → AI compare & rewrite → structured output parsing", "Conditional save to Google Drive + Slack alert with match score and link", "Invalid-query branch handles edge cases without breaking the flow"],
        },
      ],
    },
  },
  {
    id: 'ai-content-generator',
    title: 'AI Content Generator & Publisher',
    category: 'automation',
    platform: 'n8n',
    description:
      'Turns one topic into five platform-ready pieces — blog post, Instagram caption, LinkedIn post, X thread, and email newsletter — then publishes to Notion, logs to Sheets, sends via Gmail, and alerts Slack.',
    tools: ['n8n', 'Groq AI', 'Notion', 'Google Sheets', 'Gmail', 'Slack', 'JavaScript', 'Webhook'],
    stats: [
      { value: '20', label: 'Workflow nodes' },
      { value: '8', label: 'Connected apps' },
      { value: '5', label: 'Parallel AI outputs' },
    ],
    steps: [
      { label: 'Webhook', kind: 'trigger', detail: 'A single topic is submitted via webhook; the workflow immediately responds with confirmation and begins processing.' },
      { label: 'Format input', kind: 'logic', detail: 'Cleans the topic, strips noise, and structures it for consistent prompt injection across all five channels.' },
      { label: '5× AI calls', kind: 'ai', detail: 'One topic fans out into five Groq calls running in parallel, each tuned to channel voice and length.', branches: ['Blog', 'Instagram', 'LinkedIn', 'X', 'Newsletter'] },
      { label: 'Merge', kind: 'logic', detail: 'All AI outputs merge into one structured payload.' },
      { label: 'JavaScript', kind: 'logic', detail: 'A code node reformats and enriches the data before delivery.' },
      { label: 'Notion', kind: 'data', detail: 'Content is published as a new Notion database page for editorial tracking.' },
      { label: 'Sheets log', kind: 'data', detail: 'Appended to Google Sheets for audit and reporting.' },
      { label: 'Gmail', kind: 'notify', detail: 'The newsletter is sent via Gmail.' },
      { label: 'Slack', kind: 'notify', detail: 'The team is alerted on Slack.' },
      { label: 'If review', kind: 'router', detail: 'If flagged for human approval, routes to a Gmail + Slack review queue; otherwise posts a skip notification.', branches: ['Gmail review', 'Slack review', 'Slack skip'] },
    ],
    image: '/images/projects/n8n-ai-content-generator.webp',
    imageAlt: 'n8n canvas showing the 20-node AI Content Generator with five parallel AI branches',
    caseStudy: {
      howItWorks: [
        {
          stage: "Trigger",
          title: "Webhook topic submit",
          body: "Submit a single topic via webhook — the workflow responds with confirmation and starts processing.",
        },
        {
          stage: "Format",
          title: "Input normalization",
          body: "Cleans the topic and structures it for consistent prompts across all five channels.",
        },
        {
          stage: "AI Generation",
          title: "5 parallel Groq calls",
          body: "One topic fans out into five platform-specific pieces at once — blog, Instagram, LinkedIn, X and newsletter — each tuned to channel voice and length.",
        },
        {
          stage: "Merge & Code",
          title: "Aggregate & transform",
          body: "All AI outputs merge into one payload, and a JavaScript node reformats it before delivery.",
        },
        {
          stage: "Publish & Log",
          title: "Notion + Sheets",
          body: "Content is published as a Notion database page for editorial tracking and appended to Google Sheets for reporting.",
        },
        {
          stage: "Deliver & Notify",
          title: "Gmail + Slack",
          body: "The newsletter goes out via Gmail and the team is alerted on Slack. A conditional branch triggers a review flow if approval is needed.",
        },
      ],
      proof: [
        {
          image: "/images/projects/n8n-ai-content-generator.webp",
          alt: "n8n canvas showing the 20-node AI Content Generator with five parallel AI branches",
          title: "20-node n8n workflow, 5 parallel AI branches",
          caption: "Webhook → respond → format → 5 concurrent Groq nodes → merge → JavaScript → Notion → Google Sheets → Gmail → Slack → conditional review branch.",
          points: ["5 parallel AI content calls via Groq", "8 integrated apps: Webhook, Groq, JavaScript, Notion, Google Sheets, Gmail, Slack, If", "Review branch: flagged posts go to a Gmail + Slack review queue", "One webhook → full multi-channel pipeline in under 30 seconds"],
        },
      ],
    },
  },
  {
    id: 'ai-feedback-analyzer',
    title: 'AI Feedback Sentiment Analyzer',
    category: 'automation',
    platform: 'Make.com',
    description:
      'Turns raw customer feedback into instant action: OpenAI classifies sentiment, positive reviews go to social, negative ones escalate to support, everything is logged, and a companion 2-hour SLA watchdog re-alerts Slack on any negative ticket still open past 24 hours.',
    tools: ['Make.com', 'OpenAI', 'Google Sheets', 'Gmail', 'Slack', 'Buffer', 'Webhook'],
    stats: [
      { value: '2', label: 'Linked scenarios' },
      { value: '3', label: 'Sentiment routes' },
      { value: '24h', label: 'SLA watchdog' },
    ],
    steps: [
      { label: 'Webhook', kind: 'trigger', detail: 'A Make custom webhook receives the feedback form payload and immediately responds, so the form never hangs.' },
      { label: 'OpenAI sentiment', kind: 'ai', detail: 'An HTTP call to /v1/chat/completions asks OpenAI to classify the feedback as Positive, Neutral, or Negative and return a short reasoning string.' },
      { label: 'Set variable', kind: 'logic', detail: 'A Tools "Set variable" module normalizes the sentiment label.' },
      { label: 'Router', kind: 'router', detail: 'Make’s Router fans out into three deterministic branches — every submission ends up in exactly one path.', branches: ['Positive', 'Neutral', 'Negative'] },
      { label: 'Sheets log', kind: 'data', detail: 'Each branch logs a row to Google Sheets, the source of truth the SLA watchdog reads. Negative rows get an "open" status.' },
      { label: 'Gmail reply', kind: 'notify', detail: 'A thank-you, or an apology with owner assignment, goes out via Gmail.' },
      { label: 'Slack alert', kind: 'notify', detail: 'The team is pinged on Slack; negative feedback lands as an urgent alert in the support channel.' },
      { label: 'Buffer post', kind: 'action', detail: 'On the positive path, a status update is queued to Buffer for social publishing.' },
      { label: 'SLA watchdog', kind: 'schedule', detail: 'A companion scenario runs every 2 hours, searches Sheets for negative tickets open past 24 hours, and pushes a "RESOLVE NOW" Slack alert — or a lightweight digest if the queue is clear.' },
    ],
    image: '/images/projects/make-ai-feedback-main.webp',
    imageAlt: 'Make.com scenario showing webhook, OpenAI, router and three delivery branches',
    caseStudy: {
      howItWorks: [
        {
          stage: "Trigger",
          title: "Feedback webhook",
          body: "A Make custom webhook receives the form payload and responds immediately, so the form never hangs.",
        },
        {
          stage: "AI Analysis",
          title: "OpenAI sentiment",
          body: "An HTTP call to /v1/chat/completions asks OpenAI to classify the feedback as Positive, Neutral or Negative with a short reason.",
        },
        {
          stage: "Route",
          title: "3-way router",
          body: "A Set variable module normalizes the label, then Make’s Router fans out into three deterministic branches.",
        },
        {
          stage: "Positive path",
          title: "Amplify to social",
          body: "Row appended to Sheets, thank-you email via Gmail, Slack ping, and a status update queued to Buffer.",
        },
        {
          stage: "Negative path",
          title: "Escalate to support",
          body: "Row logged as \"open\", apology and owner assignment by Gmail, and an urgent Slack alert in the support channel.",
        },
        {
          stage: "SLA watchdog",
          title: "24h re-alert every 2 hours",
          body: "A companion scenario searches Sheets every 2 hours for negative tickets open past 24 hours and pushes a \"RESOLVE NOW\" Slack alert.",
        },
      ],
      proof: [
        {
          image: "/images/projects/make-ai-feedback-main.webp",
          alt: "Make.com scenario: webhook, OpenAI, router and three delivery branches",
          title: "Main scenario — webhook → AI → router → 3 branches",
          caption: "Each branch logs to Google Sheets, sends a Gmail reply and posts to Slack; the positive branch also queues a Buffer social update.",
          points: ["Customers get instant confirmation; the back office runs asynchronously", "OpenAI classification in a single HTTP module — swap models without touching the rest", "Every submission ends up in exactly one path"],
        },
        {
          image: "/images/projects/make-ai-feedback-escalation.webp",
          alt: "Make.com watchdog scenario: Sheets search, if-else, Slack escalation or digest",
          title: "SLA watchdog — every 2 hours",
          caption: "Searches Sheets for negative rows still \"open\". If a ticket is older than 24 hours it fires a \"RESOLVE NOW\" alert; otherwise it posts a lightweight digest.",
          points: ["Fixed 2-hour cadence: predictable load", "Reads the same Sheet the main scenario writes to", "Change the SLA window without touching the intake scenario"],
        },
      ],
    },
  },

  // ─────────────────────── Web apps & landing pages ───────────────────────
  {
    id: 'lmbp-talent-app',
    title: 'LMBP Talent App',
    category: 'web',
    platform: 'Full-stack web app',
    description:
      'Website and client portal for LMBP, a remote communication-team agency. Clients sign in to browse their team profiles, shortlist people and request interviews; the LMBP team uses the same login for its workspace.',
    tools: ['Claude Code', 'Next.js', 'Supabase', 'GitHub', 'Vercel'],
    image: '/images/projects/lmbp-talent-app.webp',
    imageAlt: 'LMBP homepage: "Systems first. Then scale." headline beside the LMBP Team logo',
    liveLink: 'https://lmbp-talent-app.vercel.app/',
    githubLink: null,
    repoNote: 'Private client repo',
    deepDive: 'talent-app',
  },
  {
    id: 'automation-portfolio',
    title: 'Automation Portfolio',
    category: 'web',
    platform: 'Portfolio site',
    description:
      'My current portfolio: eight automation case studies with build screenshots, services, work history, and a built-in call-booking calendar.',
    tools: ['Lovable'],
    image: '/images/projects/lovable-portfolio.webp',
    imageAlt: 'Homepage of the Mark Klent Bayucot automation portfolio, dark theme with profile photo',
    liveLink: 'https://mkbayucot.lovable.app',
    githubLink: null,
  },
]

export const automationProjects = projects.filter((p) => p.category === 'automation')
export const webProjects = projects.filter((p) => p.category === 'web')
