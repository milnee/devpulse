# DevPulse

> Instant GitHub developer analytics — no sign-up, no OAuth, no nonsense.

Paste any GitHub username (or profile URL) and get a clean, shareable analytics dashboard built entirely from public GitHub data.

---

## Features

- **Profile summary** — avatar, bio, location, followers, public repos
- **Repo stats** — total stars & forks, most starred repos, recently updated repos
- **Language breakdown** — donut chart + percentage bars aggregated across repos
- **Activity charts** — 30-day timeline (area chart) and weekday heatmap (bar chart)
- **Insights** — most active repo, primary language, activity trend vs previous 30 days, commit estimate
- **Shareable URLs** — every profile lives at `/u/<username>`, copy-link button included
- **Smart caching** — results cached for 6 hours; shows "cached as of" timestamp
- **No auth required** — works entirely with the public GitHub API

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix) |
| Charts | Recharts |
| Icons | Lucide |
| Cache | In-memory (default) · MySQL/PlanetScale (optional) |
| Hosting | Vercel |

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/milnee/devpulse.git
cd devpulse

# 2. Install
npm install

# 3. Configure env
cp .env.local.example .env.local
# → Add GITHUB_TOKEN to raise rate limits from 60 → 5000 req/hr (optional but recommended)

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Optional | Personal access token — no scopes needed. Raises rate limit from 60 → 5,000 req/hr. [Create one here.](https://github.com/settings/tokens) |
| `DATABASE_URL` | Optional | MySQL connection string for persistent cross-instance caching. Falls back to in-memory if not set. |
| `NEXT_PUBLIC_BASE_URL` | Optional | Your deployment URL. Auto-detected on Vercel via `VERCEL_URL`. |

---

## Architecture

```
lib/
  types.ts          # All TypeScript interfaces (GitHubUser, DashboardData, ApiResponse…)
  github-client.ts  # Raw GitHub REST API calls
  metrics.ts        # Pure computation — computeDashboard()
  cache.ts          # In-memory + optional MySQL cache (6 hr TTL)
  validate.ts       # Input validation — accepts username or github.com URLs

app/
  api/analyze/      # GET /api/analyze?username=… — orchestrates fetch → compute → cache
  page.tsx          # Homepage
  u/[username]/     # Results dashboard (server component, ISR)
  about/            # About page

components/
  Header.tsx
  SearchForm.tsx
  dashboard/
    ProfileCard.tsx
    RepoList.tsx
    ActivityCharts.tsx
    LanguageChart.tsx
    InsightsCard.tsx
    CopyLinkButton.tsx
```

**Data flow:**
```
User types username
  → SearchForm validates input
  → Navigates to /u/<username>
  → Server component calls /api/analyze
  → API checks cache → hit: return cached data
                     → miss: fetch GitHub (profile + repos + events + languages)
                           → computeDashboard()
                           → store in cache
                           → return JSON
  → Dashboard renders
```

---

## Rate Limits

GitHub's unauthenticated limit is **60 requests/hour per IP**. Each analysis uses:

- 1 request — user profile
- 1 request — repos list
- 1 request — public events
- Up to 15 requests — language data (top non-fork repos only)

**Total: ~18 requests per fresh analysis.** Results are cached for 6 hours so repeat visits are free.

Add a `GITHUB_TOKEN` (no scopes needed) to raise this to 5,000 req/hr.

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/milnee/devpulse)

1. Click the button above
2. Add `GITHUB_TOKEN` in the Vercel dashboard under Environment Variables
3. Done — `VERCEL_URL` is set automatically

---

## License

MIT
