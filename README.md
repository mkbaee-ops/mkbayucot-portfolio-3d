# Mark Klent Bayucot: 3D Portfolio

A futuristic, 3D portfolio for an AI Automation Specialist. Automation projects are shown as live, animated 3D workflows: nodes light up in run order, data pulses travel between them, and clicking any node explains that step.

**Stack:** React 19 · Vite · TypeScript · Three.js via `@react-three/fiber` + `@react-three/drei` · Framer Motion · Tailwind CSS v4

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build at http://localhost:4173
```

Requires Node 20+.

## Deploy to Vercel

1. Push this folder to a GitHub repo:
   ```bash
   gh repo create mkbayucot-portfolio-3d --public --source=. --push
   ```
2. On [vercel.com/new](https://vercel.com/new), import the repo. Vercel auto-detects Vite (build `npm run build`, output `dist`), so you don't need to change anything.
3. In **Project → Settings → Environment Variables**, set `VITE_SITE_URL` to your real domain (e.g. `https://mkbayucot-portfolio-3d.vercel.app`, no trailing slash), then redeploy. This fills the canonical URL and the absolute Open Graph image URLs.
4. Update the domain in `public/robots.txt` and `public/sitemap.xml` too.

Every push to `main` redeploys automatically.

## Add a project

All projects live in **`src/data/projects.ts`**. Add an object to the `projects` array and it appears on the site; you don't need to touch any components.

**Automation** (goes to the 3D workflow showcase):

```ts
{
  id: 'lead-router',                       // unique, url-safe
  title: 'AI Lead Router',
  category: 'automation',
  platform: 'n8n',                         // 'Zapier' | 'n8n' | 'Make.com' (shows the platform logo)
  description: 'One or two sentences on what it does and why it matters.',
  tools: ['n8n', 'OpenAI', 'HubSpot', 'Slack'],
  stats: [{ value: '12', label: 'Workflow nodes' }],   // optional, up to 3
  steps: [                                 // in run order; 6–10 reads best
    { label: 'Webhook', kind: 'trigger', detail: 'What this step does…' },
    { label: 'AI score', kind: 'ai', detail: '…' },
    { label: 'Route', kind: 'router', detail: '…', branches: ['Hot', 'Warm', 'Cold'] },
    { label: 'Slack alert', kind: 'notify', detail: '…' },
  ],
  image: '/images/projects/lead-router.webp',   // put the file in public/images/projects/
  imageAlt: 'n8n canvas showing the AI Lead Router workflow',
  caseStudyLink: 'https://…',              // optional
  liveLink: null,
  githubLink: null,
}
```

`kind` sets the node color and icon: `trigger`, `logic`, `ai`, `router`, `data`, `action`, `notify`, `schedule`. `branches` draws small satellite nodes that fan out below a step.

**Web app / landing page** (goes to the laptop-mockup cards):

```ts
{
  id: 'my-saas',
  title: 'My SaaS',
  category: 'web',
  platform: 'Web app',                     // short label above the title
  description: '…',
  tools: ['Claude Code', 'Supabase', 'Vercel'],
  image: '/images/projects/my-saas.webp',  // 16:10 screenshot works best
  imageAlt: 'Dashboard of My SaaS',
  liveLink: 'https://…',
  githubLink: 'https://github.com/…',
}
```

Delete the two `placeholder: true` entries once you have real web projects.

Personal info, services, experience and the tech-stack list live in **`src/data/profile.ts`**.

## How the 3D is kept fast

- **Three quality tiers** (`src/lib/device.ts`):
  - `full` (desktop): every scene runs.
  - `lite` (phones, ≤4 cores, ≤4 GB RAM, Save-Data): a lighter background scene that loads only after the first scroll or tap, plus 2D CSS versions of the workflow and stack sections.
  - `static` (`prefers-reduced-motion` or no WebGL): no canvases at all, a gradient backdrop, and non-animated fallbacks.
- **Lazy loading:** all three.js code sits in lazily imported chunks. The background loads after `load` and idle; the workflow and stack canvases mount only when scrolled near, and pause (`frameloop="never"`) when off-screen.
- **Pixel ratio** is capped at 1.5 (1 on lite).
- **No backdrop blur over the WebGL layer**, which would re-blur every frame. Panels use a dense tint instead.

Lighthouse on the production build (local): **desktop 100 / 100 / 100 / 100**, mobile 80 / 100 / 100 / 100 (performance / accessibility / best practices / SEO).

## Accessibility

- Semantic sections, one `h1`, labelled landmarks, and a skip link.
- Every 3D scene is `aria-hidden` and has a real HTML control next to it. Workflow steps are buttons (arrow keys, Home and End work), projects are an ARIA tablist, and the stack has an accessible list.
- Visible focus rings, and colors chosen for contrast on the near-black background.
- `MotionConfig reducedMotion="user"`, plus CSS that disables animation for reduced-motion users.

## Project structure

```
src/
  data/        projects.ts (all projects) · profile.ts (bio, contact, experience, stack)
  sections/    Hero · About · Automations · WebProjects · TechStack · Experience · Contact
  three/       BackgroundScene (hero network + scroll flythrough) · WorkflowScene · StackSphere
  components/  Nav · StepList (2D/accessible workflow) · StepKind (colors/icons) · ui
  lib/         device.ts (quality tiers) · useInView.ts
scripts/       generate-og.mjs  →  `npm run og` regenerates public/og-image.png
```

## Credits

Tool logos come from [Simple Icons](https://simpleicons.org) (CC0). Content is sourced from [mkbayucot.lovable.app](https://mkbayucot.lovable.app).
