// Generates public/og-image.png (1200×630) for social previews.
// Run: npm run og
import sharp from 'sharp'

const W = 1200
const H = 630

// Deterministic node network on the right-hand side
let seed = 42
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const nodes = Array.from({ length: 46 }, () => {
  const a = rand() * Math.PI * 2
  const r = Math.sqrt(rand()) * 230
  return { x: 900 + Math.cos(a) * r, y: 315 + Math.sin(a) * r * 0.95 }
})
const edges = []
nodes.forEach((n, i) => {
  nodes
    .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
    .filter((e) => e.j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .forEach(({ j }) => edges.push([n, nodes[j]]))
})

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glowA" cx="75%" cy="45%" r="45%"><stop offset="0" stop-color="#3b82f6" stop-opacity=".35"/><stop offset="1" stop-color="#05060a" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowB" cx="15%" cy="85%" r="40%"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".25"/><stop offset="1" stop-color="#05060a" stop-opacity="0"/></radialGradient>
    <linearGradient id="txt" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#3b82f6"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient>
    <linearGradient id="edge" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="#05060a"/>
  <rect width="100%" height="100%" fill="url(#glowA)"/>
  <rect width="100%" height="100%" fill="url(#glowB)"/>
  <g stroke="url(#edge)" stroke-opacity=".35" stroke-width="1.2">
    ${edges.map(([a, b]) => `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}"/>`).join('')}
  </g>
  <g fill="#9eeefc" filter="url(#blur)">${nodes.map((n) => `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="5"/>`).join('')}</g>
  <g fill="#e6f6ff">${nodes.map((n, i) => `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${i % 6 ? 2.4 : 3.6}"/>`).join('')}</g>

  <g font-family="Segoe UI, Inter, Arial, sans-serif">
    <rect x="80" y="150" width="330" height="40" rx="20" fill="#22d3ee" fill-opacity=".08" stroke="#22d3ee" stroke-opacity=".4"/>
    <circle cx="102" cy="170" r="4" fill="#22d3ee"/>
    <text x="116" y="176" font-size="16" letter-spacing="3" fill="#22d3ee" font-weight="600">AI AUTOMATION SPECIALIST</text>
    <text x="80" y="285" font-size="84" font-weight="700" fill="#e6edf7">Mark Klent</text>
    <text x="80" y="378" font-size="84" font-weight="700" fill="url(#txt)">Bayucot</text>
    <text x="80" y="440" font-size="26" fill="#9aa8bd">n8n · Zapier · Make · Claude Code · Supabase · Vercel</text>
    <text x="80" y="520" font-size="20" fill="#e6edf7" fill-opacity=".8">I build real AI systems · Cebu, Philippines</text>
  </g>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og-image.png')
console.log('✓ public/og-image.png')
