import type {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  DashboardData,
  RepoSummary,
  LanguageEntry,
  ActivityBreakdown,
  DailyActivity,
  WeekdayActivity,
  Insights,
} from "./types";
import { fetchRepoLanguages } from "./github-client";

// ── Constants ─────────────────────────────────────────────────────────────────

/**
 * Maximum repos for which we call the /languages endpoint.
 * Keeps total API requests per analysis ≤ 18 (safe under the 60 req/hr limit).
 */
const LANGUAGE_FETCH_LIMIT = 15;

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Approximate language → hex color mapping (GitHub-inspired palette) */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Scala: "#c22d40",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

function langColor(lang: string): string {
  return LANGUAGE_COLORS[lang] ?? "#8b949e";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toRepoSummary(r: GitHubRepo): RepoSummary {
  return {
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language,
    updated_at: r.updated_at,
    pushed_at: r.pushed_at,
  };
}

/** Returns ISO date string YYYY-MM-DD in UTC */
function toDateStr(iso: string): string {
  return iso.slice(0, 10);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

// ── Language aggregation ──────────────────────────────────────────────────────

async function computeLanguages(
  repos: GitHubRepo[]
): Promise<LanguageEntry[]> {
  // Only fetch for the top-N most-recently-updated, non-fork repos.
  // Forks are skipped because they inflate language stats with upstream code.
  const candidates = repos
    .filter((r) => !r.fork)
    .slice(0, LANGUAGE_FETCH_LIMIT);

  const results = await Promise.all(
    candidates.map((r) =>
      fetchRepoLanguages(r.full_name.split("/")[0], r.name)
    )
  );

  // Aggregate byte counts across all repos
  const totals: Record<string, number> = {};
  for (const langMap of results) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      totals[lang] = (totals[lang] ?? 0) + bytes;
    }
  }

  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);
  if (grandTotal === 0) return [];

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // top 10 languages in the chart
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Math.round((bytes / grandTotal) * 1000) / 10,
      color: langColor(language),
    }));
}

// ── Activity computation ──────────────────────────────────────────────────────

function computeActivity(events: GitHubEvent[]): ActivityBreakdown {
  const now = new Date();
  const cutoff30 = daysAgo(30);

  // Build day → count map for last 30 days
  const dailyMap: Record<string, number> = {};
  // Pre-fill all 30 days with 0 so chart has no gaps
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }

  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun–Sat

  let pushEvents = 0;
  let prEvents = 0;
  let issueEvents = 0;
  let otherEvents = 0;

  for (const ev of events) {
    const evDate = new Date(ev.created_at);
    if (evDate < cutoff30) continue;

    const dateKey = toDateStr(ev.created_at);
    dailyMap[dateKey] = (dailyMap[dateKey] ?? 0) + 1;
    weekdayCounts[evDate.getUTCDay()]++;

    if (ev.type === "PushEvent") pushEvents++;
    else if (ev.type === "PullRequestEvent") prEvents++;
    else if (ev.type === "IssuesEvent" || ev.type === "IssueCommentEvent") issueEvents++;
    else otherEvents++;
  }

  const daily: DailyActivity[] = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const byWeekday: WeekdayActivity[] = WEEKDAY_LABELS.map((day, i) => ({
    day,
    count: weekdayCounts[i],
  }));

  return {
    pushEvents,
    prEvents,
    issueEvents,
    otherEvents,
    total: pushEvents + prEvents + issueEvents + otherEvents,
    daily,
    byWeekday,
  };
}

// ── Insights ──────────────────────────────────────────────────────────────────

function computeInsights(
  events: GitHubEvent[],
  languages: LanguageEntry[]
): Insights {
  // Most active repo in last 30 days
  const now = new Date();
  const cutoff30 = daysAgo(30);
  const cutoff60 = daysAgo(60);

  const repoCounts: Record<string, number> = {};
  let recent30 = 0;
  let prev30 = 0;

  for (const ev of events) {
    const evDate = new Date(ev.created_at);
    const repoName = ev.repo.name;

    if (evDate >= cutoff30) {
      repoCounts[repoName] = (repoCounts[repoName] ?? 0) + 1;
      recent30++;
    } else if (evDate >= cutoff60) {
      prev30++;
    }
  }

  const mostActiveRepo =
    Object.entries(repoCounts).sort(([, a], [, b]) => b - a)[0]?.[0]?.split("/")[1] ??
    null;

  const mostUsedLanguage = languages[0]?.language ?? null;

  // Activity trend: % change from prev30 to recent30
  let activityTrend = 0;
  if (prev30 > 0) {
    activityTrend = Math.round(((recent30 - prev30) / prev30) * 100);
  } else if (recent30 > 0) {
    activityTrend = 100; // went from 0 → something
  }

  // Estimate commits: count PushEvent commit arrays
  const totalCommitsEstimate = events
    .filter((e) => e.type === "PushEvent")
    .reduce((sum, e) => sum + (e.payload.commits?.length ?? 1), 0);

  return {
    mostActiveRepo,
    mostUsedLanguage,
    activityTrend,
    totalCommitsEstimate,
  };
}

// ── Main entry-point ──────────────────────────────────────────────────────────

export async function computeDashboard(
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[]
): Promise<DashboardData> {
  // Run language fetch + activity computation concurrently
  const [languages, activity] = await Promise.all([
    computeLanguages(repos),
    Promise.resolve(computeActivity(events)),
  ]);

  const insights = computeInsights(events, languages);

  // Sort repos by stars for "most starred" list
  const byStars = [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(toRepoSummary);

  // Sort repos by updated_at for "recently updated" list
  const byUpdated = [...repos]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5)
    .map(toRepoSummary);

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  return {
    username: user.login,
    profile: user,
    totalStars,
    totalForks,
    mostStarredRepos: byStars,
    recentlyUpdatedRepos: byUpdated,
    languages,
    activity,
    insights,
    cachedAt: new Date().toISOString(),
    dataSource: "github-public-api",
  };
}
