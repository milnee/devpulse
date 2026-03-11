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
const WEEKDAY_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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

/**
 * Convert a UTC ISO string to a local date string (YYYY-MM-DD)
 * using the provided timezone offset in minutes east of UTC.
 */
function toLocalDateStr(isoStr: string, tzOffsetMin: number): string {
  const ms = new Date(isoStr).getTime() + tzOffsetMin * 60_000;
  return new Date(ms).toISOString().slice(0, 10);
}

function daysAgo(n: number, tzOffsetMin = 0): Date {
  const d = new Date(Date.now() + tzOffsetMin * 60_000);
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

// ── Streak calculation ────────────────────────────────────────────────────────

function computeStreak(daily: DailyActivity[]): { current: number; longest: number } {
  let current = 0, longest = 0, running = 0;
  for (const d of daily) {
    if (d.count > 0) { running++; longest = Math.max(longest, running); }
    else { running = 0; }
  }
  // Current streak counts backward from the last day
  for (let i = daily.length - 1; i >= 0; i--) {
    if (daily[i].count > 0) current++;
    else break;
  }
  return { current, longest };
}

// ── Activity computation ──────────────────────────────────────────────────────

function computeActivity(
  events: GitHubEvent[],
  username: string,
  tzOffsetMin = 0,
): ActivityBreakdown {
  const cutoff30 = daysAgo(30, tzOffsetMin);
  const cutoff90 = daysAgo(90, tzOffsetMin);

  // Pre-fill 90-day map (heatmap + area chart)
  const map90: Record<string, number> = {};
  for (let i = 89; i >= 0; i--) {
    map90[daysAgo(i, tzOffsetMin).toISOString().slice(0, 10)] = 0;
  }

  // Pre-fill 30-day map (stat pills)
  const map30: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    map30[daysAgo(i, tzOffsetMin).toISOString().slice(0, 10)] = 0;
  }

  const weekdayCounts30 = [0, 0, 0, 0, 0, 0, 0]; // 30d for chart
  const weekdayCounts90 = [0, 0, 0, 0, 0, 0, 0]; // 90d for mostActiveDay
  const hourCounts = new Array(24).fill(0) as number[];

  let pushEvents = 0, prEvents = 0, issueEvents = 0, otherEvents = 0;
  let prOpened = 0, issuesOpened = 0, codeReviews = 0;
  let linesAdded = 0, linesDeleted = 0;
  const foreignRepos = new Set<string>();

  for (const ev of events) {
    const evDate = new Date(ev.created_at);
    if (evDate < cutoff90) continue;

    // Use local date for bucketing (timezone-aware)
    const key = toLocalDateStr(ev.created_at, tzOffsetMin);
    map90[key] = (map90[key] ?? 0) + 1;

    // Weekday & hour still in local time
    const localDate = new Date(evDate.getTime() + tzOffsetMin * 60_000);
    weekdayCounts90[localDate.getUTCDay()]++;
    hourCounts[localDate.getUTCHours()]++;

    // Contributed-to: repos not owned by this user
    const [owner] = ev.repo.name.split("/");
    if (owner.toLowerCase() !== username.toLowerCase()) {
      foreignRepos.add(ev.repo.name);
    }

    // PR metrics
    if (ev.type === "PullRequestEvent") {
      if (ev.payload.action === "opened") prOpened++;
      const pr = ev.payload.pull_request;
      if (pr?.additions) linesAdded += pr.additions;
      if (pr?.deletions) linesDeleted += pr.deletions;
    } else if (ev.type === "IssuesEvent" && ev.payload.action === "opened") {
      issuesOpened++;
    } else if (ev.type === "PullRequestReviewEvent") {
      codeReviews++;
    }

    // 30-day counters
    if (evDate >= cutoff30) {
      map30[key] = (map30[key] ?? 0) + 1;
      weekdayCounts30[localDate.getUTCDay()]++;
      if (ev.type === "PushEvent") pushEvents++;
      else if (ev.type === "PullRequestEvent") prEvents++;
      else if (ev.type === "IssuesEvent" || ev.type === "IssueCommentEvent") issueEvents++;
      else otherEvents++;
    }
  }

  const daily90: DailyActivity[] = Object.entries(map90)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const { current: currentStreak, longest: longestStreak } = computeStreak(daily90);

  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const maxDayIdx = weekdayCounts90.indexOf(Math.max(...weekdayCounts90));
  const mostActiveDay = WEEKDAY_FULL[maxDayIdx] ?? "Unknown";

  const daily: DailyActivity[] = Object.entries(map30)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const byWeekday: WeekdayActivity[] = WEEKDAY_LABELS.map((day, i) => ({
    day, count: weekdayCounts30[i],
  }));

  return {
    pushEvents, prEvents, issueEvents, otherEvents,
    total: pushEvents + prEvents + issueEvents + otherEvents,
    prOpened, issuesOpened, codeReviews,
    contributedTo: foreignRepos.size,
    linesAdded, linesDeleted,
    currentStreak, longestStreak,
    mostActiveDay, peakHour,
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
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[],
  tzOffsetMin = 0,
): Promise<DashboardData> {
  const [languages, activity] = await Promise.all([
    computeLanguages(repos),
    Promise.resolve(computeActivity(events, user.login, tzOffsetMin)),
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
