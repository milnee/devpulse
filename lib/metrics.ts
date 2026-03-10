import type {
  GitHubUser, GitHubRepo, GitHubEvent,
  DashboardData, RepoSummary, LanguageEntry,
  ActivityBreakdown, DailyActivity, WeekdayActivity,
  Insights, CommitSummary,
} from "./types";
import { fetchRepoLanguages } from "./github-client";

// ── Constants ─────────────────────────────────────────────────────────────────

const LANGUAGE_FETCH_LIMIT = 15;
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", "C#": "#178600", Ruby: "#701516", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", HTML: "#e34c26",
  CSS: "#563d7c", Shell: "#89e051", Scala: "#c22d40", Haskell: "#5e5086",
  Elixir: "#6e4a7e", Vue: "#41b883", Svelte: "#ff3e00",
};

function langColor(lang: string): string {
  return LANGUAGE_COLORS[lang] ?? "#8b949e";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toRepoSummary(r: GitHubRepo): RepoSummary {
  return {
    name: r.name, full_name: r.full_name, html_url: r.html_url,
    description: r.description, stars: r.stargazers_count,
    forks: r.forks_count, language: r.language,
    updated_at: r.updated_at, pushed_at: r.pushed_at,
  };
}

function toDateStr(iso: string): string { return iso.slice(0, 10); }

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

// ── Language aggregation ──────────────────────────────────────────────────────

async function computeLanguages(repos: GitHubRepo[]): Promise<LanguageEntry[]> {
  const candidates = repos.filter((r) => !r.fork).slice(0, LANGUAGE_FETCH_LIMIT);
  const results = await Promise.all(
    candidates.map((r) => fetchRepoLanguages(r.full_name.split("/")[0], r.name))
  );

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
    .slice(0, 10)
    .map(([language, bytes]) => ({
      language, bytes,
      percentage: Math.round((bytes / grandTotal) * 1000) / 10,
      color: langColor(language),
    }));
}

// ── Activity computation ──────────────────────────────────────────────────────

function computeActivity(events: GitHubEvent[]): ActivityBreakdown {
  const cutoff30 = daysAgo(30);
  const cutoff90 = daysAgo(90);

  // Pre-fill 90-day map (used for heatmap)
  const map90: Record<string, number> = {};
  for (let i = 89; i >= 0; i--) {
    map90[daysAgo(i).toISOString().slice(0, 10)] = 0;
  }

  // Pre-fill 30-day map (used for area chart)
  const map30: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    map30[daysAgo(i).toISOString().slice(0, 10)] = 0;
  }

  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  let pushEvents = 0, prEvents = 0, issueEvents = 0, otherEvents = 0;

  for (const ev of events) {
    const evDate = new Date(ev.created_at);
    if (evDate < cutoff90) continue;

    const key = toDateStr(ev.created_at);

    // Always add to 90-day map
    map90[key] = (map90[key] ?? 0) + 1;

    // Only add to 30-day counters/map if within 30 days
    if (evDate >= cutoff30) {
      map30[key] = (map30[key] ?? 0) + 1;
      weekdayCounts[evDate.getUTCDay()]++;
      if (ev.type === "PushEvent") pushEvents++;
      else if (ev.type === "PullRequestEvent") prEvents++;
      else if (ev.type === "IssuesEvent" || ev.type === "IssueCommentEvent") issueEvents++;
      else otherEvents++;
    }
  }

  const daily: DailyActivity[] = Object.entries(map30)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const daily90: DailyActivity[] = Object.entries(map90)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const byWeekday: WeekdayActivity[] = WEEKDAY_LABELS.map((day, i) => ({
    day, count: weekdayCounts[i],
  }));

  return {
    pushEvents, prEvents, issueEvents, otherEvents,
    total: pushEvents + prEvents + issueEvents + otherEvents,
    daily, daily90, byWeekday,
  };
}

// ── Recent commits extraction ─────────────────────────────────────────────────

function extractCommits(events: GitHubEvent[]): CommitSummary[] {
  const commits: CommitSummary[] = [];
  for (const ev of events) {
    if (ev.type !== "PushEvent") continue;
    const repoName = ev.repo.name.split("/")[1] ?? ev.repo.name;
    const repoUrl = `https://github.com/${ev.repo.name}`;
    // Iterate commits in reverse (most recent first within the push)
    for (const commit of [...(ev.payload.commits ?? [])].reverse()) {
      const msg = commit.message.split("\n")[0].trim();
      // Skip auto-generated merge commits
      if (msg.startsWith("Merge pull request") || msg.startsWith("Merge branch")) continue;
      commits.push({ repo: repoName, repoUrl, message: msg.slice(0, 80), pushedAt: ev.created_at });
      if (commits.length >= 8) return commits;
    }
  }
  return commits;
}

// ── Insights ──────────────────────────────────────────────────────────────────

function computeInsights(events: GitHubEvent[], languages: LanguageEntry[]): Insights {
  const cutoff30 = daysAgo(30);
  const cutoff60 = daysAgo(60);

  const repoCounts: Record<string, number> = {};
  let recent30 = 0, prev30 = 0;

  for (const ev of events) {
    const evDate = new Date(ev.created_at);
    if (evDate >= cutoff30) {
      repoCounts[ev.repo.name] = (repoCounts[ev.repo.name] ?? 0) + 1;
      recent30++;
    } else if (evDate >= cutoff60) {
      prev30++;
    }
  }

  const mostActiveRepo =
    Object.entries(repoCounts).sort(([, a], [, b]) => b - a)[0]?.[0]?.split("/")[1] ?? null;

  const activityTrend = prev30 > 0
    ? Math.round(((recent30 - prev30) / prev30) * 100)
    : recent30 > 0 ? 100 : 0;

  const totalCommitsEstimate = events
    .filter((e) => e.type === "PushEvent")
    .reduce((sum, e) => sum + (e.payload.commits?.length ?? 1), 0);

  return {
    mostActiveRepo,
    mostUsedLanguage: languages[0]?.language ?? null,
    activityTrend,
    totalCommitsEstimate,
  };
}

// ── Main entry-point ──────────────────────────────────────────────────────────

export async function computeDashboard(
  user: GitHubUser, repos: GitHubRepo[], events: GitHubEvent[]
): Promise<DashboardData> {
  const [languages, activity] = await Promise.all([
    computeLanguages(repos),
    Promise.resolve(computeActivity(events)),
  ]);

  const insights = computeInsights(events, languages);
  const commits = extractCommits(events);

  const byStars = [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5).map(toRepoSummary);

  const byUpdated = [...repos]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5).map(toRepoSummary);

  return {
    username: user.login, profile: user,
    totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    totalForks: repos.reduce((s, r) => s + r.forks_count, 0),
    mostStarredRepos: byStars, recentlyUpdatedRepos: byUpdated,
    languages, activity, commits, insights,
    cachedAt: new Date().toISOString(),
    dataSource: "github-public-api",
  };
}
