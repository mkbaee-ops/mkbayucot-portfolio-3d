// Engineering case studies. Each one is linked from its project via `deepDive: '<id>'` in projects.ts.
// Facts come from the project code, docs and saved run logs; keep it that way when you edit.

export type CaseStudy = {
  id: string
  title: string
  kicker: string
  summary: string
  problem: string
  /** Rendered as the architecture diagram, left to right (top to bottom on phones) */
  architecture: { title: string; items: string[] }[]
  decision: { title: string; body: string }
  broke: { title: string; body: string }
  results: { value: string; label: string }[]
  resultNote: string
  liveLink?: string
  repo: { href?: string; note: string }
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'lead-engine',
    title: 'AI Lead Research Engine',
    kicker: 'Claude Code · Python · Scrapling',
    summary: 'One chat message runs a full, auditable lead research pass for LMBP’s Chat Operations team.',
    problem:
      'LMBP sells trained remote chat teams, and its sales process starts with a research SOP: find companies hiring support staff, prove they have a real need, and find the right person to contact, with every claim backed by a source. The goal was to run that SOP from a single chat message, without breaking any job board’s terms of use.',
    architecture: [
      { title: 'Interface', items: ['Chat request', 'Claude Code runs the CLI and reports the funnel'] },
      {
        title: 'Sources',
        items: ['JSearch API (licensed Google for Jobs)', 'Remotive · Remote OK · We Work Remotely · Himalayas · Working Nomads', 'Greenhouse · Lever · Ashby · Workable + 3 more careers-board APIs'],
      },
      {
        title: 'Python pipeline',
        items: ['Group postings by company', 'Level 1: industry fit + hiring signals', 'Level 2: Scrapling reads the company site', '0–100 rubric → Priority A / B / C / Partner'],
      },
      { title: 'Enrichment', items: ['Prospeo / Apollo APIs, Priority A only', 'Verified emails only, never guessed'] },
      { title: 'Outputs', items: ['Google Sheets, de-duplicated', 'Excel copy of every run', 'Skip list (1,047 companies)'] },
    ],
    decision: {
      title: 'Compliance over volume',
      body: 'Postings come only from licensed APIs, public careers-board APIs and companies’ own websites. LinkedIn, Indeed and Glassdoor are never scraped, robots.txt is checked first, and there is no anti-bot bypass. That meant fewer postings at first, so instead of scraping harder I added public careers-board APIs (Greenhouse, Lever, Ashby, Workable and others). Postings per run went from 720 to 1,261 the day they went live, and every daily run since Oct 20 has screened more than 2,200.',
    },
    broke: {
      title: 'The industry check was rejecting good companies',
      body: 'Reviewing the skip list showed that 571 of 577 rejections were “no industry fit”, including Calendly, Canva, Coinbase and Wise. Industry keywords were being matched against job-ad text, which describes the role, not the company. The fix: match industry keywords on the company’s homepage only, take the industry from the curated target list when a company is on it, and let old industry rejections be re-judged instead of staying blocked.',
    },
    results: [
      { value: '9 → 37', label: 'Qualified leads per daily run' },
      { value: '8 → 31', label: 'Verified contact emails per run' },
      { value: '45 → 11', label: 'Companies rejected for “no fit”' },
    ],
    resultNote:
      'Daily runs before and after the fix (Oct 23 vs Oct 26, 2026). Latest run: 2,339 postings → 265 companies → 97 researched → 39 qualified leads and 17 verified emails.',
    repo: { note: 'Private client repo. Code walkthrough available on request.' },
  },
  {
    id: 'talent-app',
    title: 'LMBP Talent App',
    kicker: 'Next.js · Supabase · Vercel',
    summary: 'A public website plus a secure client portal where staffing clients browse and shortlist LMBP’s team.',
    problem:
      'LMBP needed to show clients its remote team members and let them pick who they want, without emailing CVs around. Each client may only see the people assigned to them, and the LMBP team needs to track every shortlist from first pick to hire.',
    architecture: [
      { title: 'Users', items: ['Admin (LMBP team)', 'Client', 'Employee'] },
      { title: 'Next.js 15 on Vercel', items: ['Middleware checks the session on every request', 'Server actions; admin-only service key', 'Public site · /talent · /admin · /team'] },
      { title: 'Supabase', items: ['Auth with 3 roles', 'Postgres + Row Level Security on 5 tables', 'Storage for profile photos'] },
      { title: 'Integrations', items: ['Google Calendar: discovery-call bookings', 'In-browser Excel / CSV and resume import'] },
    ],
    decision: {
      title: 'Enforce access in the database, not the UI',
      body: 'The browser talks to Supabase with a public key, so hiding things in the interface is not security. Every table has Row Level Security: a client can only read employees assigned to them and only their own shortlist, even if they query the database directly. The service-role key never reaches the browser; the server uses it only after confirming the caller is an admin. Resume import follows the same thinking: files are parsed in the browser with plain rules, nothing is sent anywhere, and a person reviews every result before it is saved.',
    },
    broke: {
      title: 'Adding a third role without loosening the rules',
      body: 'The first version had two roles, admin and client. When LMBP wanted employee logins for its internal team hub, the existing policies blocked employees from the profiles the hub needs. The fix was a migration that adds the employee role, plus one narrow “staff read” policy for admins and employees, leaving client access exactly as tight as before.',
    },
    results: [
      { value: '3', label: 'User roles' },
      { value: '16', label: 'Database access policies' },
      { value: '5', label: 'Tables protected by RLS' },
    ],
    resultNote: 'Live in production for LMBP on Vercel.',
    liveLink: 'https://lmbp-talent-app.vercel.app/',
    repo: { note: 'Private client repo. Code walkthrough available on request.' },
  },
]
