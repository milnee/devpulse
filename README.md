<div align="center">
  <h1>DevPulse</h1>
  <p><strong>Instant GitHub developer analytics — no sign-up, no OAuth, no nonsense.</strong></p>
  <p>
    <a href="https://devpulse-afks.vercel.app">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel" alt="Vercel" />
  </p>
</div>

<br />

<p align="center">
  <img src="./screenshots/dashboard.png" alt="DevPulse Dashboard" width="100%" />
</p>

## Why DevPulse?

Most GitHub analytics tools require an account, OAuth permissions, or a paid plan. **DevPulse is different** — paste any username and get a full analytics dashboard instantly, built entirely from the public GitHub API.

- **No sign-up required** — Works for any public GitHub profile, no account needed
- **Shareable URLs** — Every profile has a permanent `/u/<username>` link
- **Smart caching** — 6-hour TTL means repeat visits are instant
- **Compare developers** — Side-by-side analytics at `/compare`

## Features

| | |
|---|---|
| **Profile overview** | Avatar, bio, location, company, social links, follower & star counts |
| **Contribution heatmap** | 90-day calendar grid with current & longest streaks |
| **Activity charts** | 30-day push timeline + weekday activity breakdown |
| **Language breakdown** | Interactive donut chart + ranked bars across all public repos |
| **Repo explorer** | Most starred and recently updated repos with language tags |
| **Insights** | Primary language, most active repo, activity trend vs prior 30 days |
| **Recent commits** | Latest push events with repo context and timestamps |
| **Developer compare** | Head-to-head view for any two GitHub users |
| **Light & dark mode** | Theme toggle, respects `prefers-color-scheme` |
| **Timezone-aware** | Streaks and heatmaps in the viewer's local timezone |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/milnee/devpulse.git
cd devpulse

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Add GITHUB_TOKEN to raise the rate limit from 60 → 5,000 req/hr (recommended)

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search any GitHub username.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Recommended | Personal access token (no scopes needed). Raises API rate limit to 5,000 req/hr. [Create one →](https://github.com/settings/tokens) |
| `DATABASE_URL` | Optional | MySQL connection string for persistent caching. Falls back to in-memory. |
| `NEXT_PUBLIC_BASE_URL` | Optional | Your deployment URL. Auto-detected on Vercel. |

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide](https://lucide.dev/) |
| Cache | In-memory (default) · MySQL / PlanetScale (optional) |
| Hosting | [Vercel](https://vercel.com/) |

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/milnee/devpulse)

1. Click **Deploy** above
2. Add `GITHUB_TOKEN` in Vercel → Settings → Environment Variables
3. Done — `VERCEL_URL` is set automatically

## License

MIT License — free for personal and commercial use.

---

<div align="center">
  <p><strong>Any developer. Any profile. Instant insights.</strong></p>
  <p><a href="https://devpulse-afks.vercel.app">devpulse-afks.vercel.app</a></p>
</div>
