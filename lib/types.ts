// ── Raw GitHub API shapes ─────────────────────────────────────────────────────

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  updated_at: string;
  created_at: string;
  size: number;
}

export interface GitHubEventPayload {
  commits?: { message: string; sha?: string }[];
  action?: string;
  pull_request?: {
    title: string;
    additions?: number;
    deletions?: number;
    merged?: boolean;
  };
  issue?: { title: string };
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: { id: number; name: string; url: string };
  payload: GitHubEventPayload;
  created_at: string;
}

// ── Computed / derived shapes ─────────────────────────────────────────────────

export interface LanguageEntry {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface RepoSummary {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
}

/** A single commit extracted from a PushEvent */
export interface CommitSummary {
  repo: string;      // repo name without owner
  repoUrl: string;   // https://github.com/owner/repo
  message: string;   // first line, max 80 chars
  pushedAt: string;  // ISO timestamp of the push event
}

export interface DailyActivity {
  date: string;  // YYYY-MM-DD
  count: number;
}

export interface WeekdayActivity {
  day: string;   // "Sun" … "Sat"
  count: number;
}

export interface ActivityBreakdown {
  // 30-day event type counts
  pushEvents: number;
  prEvents: number;
  issueEvents: number;
  otherEvents: number;
  total: number;
  // 90-day detailed contribution counts
  prOpened: number;
  issuesOpened: number;
  codeReviews: number;
  contributedTo: number;
  linesAdded: number;
  linesDeleted: number;
  // Streaks (from daily90)
  currentStreak: number;
  longestStreak: number;
  // Work patterns
  mostActiveDay: string;   // e.g. "Tuesday"
  peakHour: number;        // 0–23 UTC
  // Chart data
  daily: DailyActivity[];
  daily90: DailyActivity[];
  byWeekday: WeekdayActivity[];
}

export interface Insights {
  mostActiveRepo: string | null;
  mostUsedLanguage: string | null;
  activityTrend: number;
  totalCommitsEstimate: number;
}

// ── Top-level dashboard response ─────────────────────────────────────────────

export interface DashboardData {
  username: string;
  profile: GitHubUser;
  totalStars: number;
  totalForks: number;
  mostStarredRepos: RepoSummary[];
  recentlyUpdatedRepos: RepoSummary[];
  languages: LanguageEntry[];
  activity: ActivityBreakdown;
  commits: CommitSummary[];
  insights: Insights;
  cachedAt: string;
  dataSource: "github-public-api";
}

// ── API response wrapper ──────────────────────────────────────────────────────

export type ApiSuccess = { ok: true; data: DashboardData };
export type ApiError = {
  ok: false;
  error: string;
  code: "NOT_FOUND" | "RATE_LIMITED" | "INVALID_INPUT" | "NETWORK_ERROR" | "UNKNOWN";
  /** Seconds until rate limit resets (only set when code === "RATE_LIMITED") */
  retryAfter?: number;
};
export type ApiResponse = ApiSuccess | ApiError;
