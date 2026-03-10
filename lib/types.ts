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
  // push event
  commits?: { message: string }[];
  // pr event
  action?: string;
  pull_request?: { title: string };
  // issue event
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

/** One data-point per day in YYYY-MM-DD format */
export interface DailyActivity {
  date: string;
  count: number;
}

/** Weekday buckets: 0=Sunday … 6=Saturday */
export interface WeekdayActivity {
  day: string; // "Sun", "Mon", …
  count: number;
}

export interface ActivityBreakdown {
  pushEvents: number;
  prEvents: number;
  issueEvents: number;
  otherEvents: number;
  total: number;
  daily: DailyActivity[];
  byWeekday: WeekdayActivity[];
}

export interface Insights {
  mostActiveRepo: string | null;
  mostUsedLanguage: string | null;
  activityTrend: number; // percentage change vs previous 30 days (can be negative)
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
  insights: Insights;
  cachedAt: string; // ISO timestamp
  dataSource: "github-public-api";
}

// ── API response wrapper ──────────────────────────────────────────────────────

export type ApiSuccess = { ok: true; data: DashboardData };
export type ApiError = {
  ok: false;
  error: string;
  code: "NOT_FOUND" | "RATE_LIMITED" | "INVALID_INPUT" | "NETWORK_ERROR" | "UNKNOWN";
};
export type ApiResponse = ApiSuccess | ApiError;
