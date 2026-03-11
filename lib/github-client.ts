import type { GitHubUser, GitHubRepo, GitHubEvent } from "./types";

const BASE = "https://api.github.com";

/**
 * Build request headers.
 * We use the optional GITHUB_TOKEN env var to raise rate limits from 60 → 5000 req/hr.
 * Without it the app still works for development and low-traffic use.
 */
function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    h["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

/** Thin fetch wrapper that throws typed errors */
async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(),
    // Next.js: opt-out of full static caching so we control staleness ourselves
    next: { revalidate: 0 },
  });

  if (res.status === 404) {
    const err = new Error("GitHub user not found") as Error & { code: string };
    err.code = "NOT_FOUND";
    throw err;
  }
  if (res.status === 403 || res.status === 429) {
    // Parse Retry-After header (seconds) or X-RateLimit-Reset (unix timestamp)
    let retryAfter: number | undefined;
    const retryAfterHeader = res.headers.get("Retry-After");
    const resetHeader = res.headers.get("X-RateLimit-Reset");
    if (retryAfterHeader) {
      retryAfter = parseInt(retryAfterHeader, 10);
    } else if (resetHeader) {
      retryAfter = Math.max(0, parseInt(resetHeader, 10) - Math.floor(Date.now() / 1000));
    }
    const err = new Error("GitHub API rate limit exceeded") as Error & { code: string; retryAfter?: number };
    err.code = "RATE_LIMITED";
    err.retryAfter = retryAfter;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`GitHub API error: ${res.status}`) as Error & { code: string };
    err.code = "UNKNOWN";
    throw err;
  }

  return res.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchUser(username: string): Promise<GitHubUser> {
  return ghFetch<GitHubUser>(`/users/${encodeURIComponent(username)}`);
}

/**
 * Fetch up to 100 repos sorted by last update.
 * We only request public repos — no auth required.
 */
export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  return ghFetch<GitHubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`
  );
}

/**
 * Fetch up to 300 public events (3 pages × 100) for 90-day coverage.
 * Pages 2 and 3 are optional — tolerate failure so sparse accounts still work.
 * GitHub hard-caps at 300 total events regardless of pagination.
 */
export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  const u = encodeURIComponent(username);
  const [p1, p2, p3] = await Promise.all([
    ghFetch<GitHubEvent[]>(`/users/${u}/events/public?per_page=100&page=1`),
    ghFetch<GitHubEvent[]>(`/users/${u}/events/public?per_page=100&page=2`).catch(() => [] as GitHubEvent[]),
    ghFetch<GitHubEvent[]>(`/users/${u}/events/public?per_page=100&page=3`).catch(() => [] as GitHubEvent[]),
  ]);
  return [...p1, ...p2, ...p3];
}

/**
 * Fetch language byte-counts for a single repo.
 * Returns a map of { TypeScript: 12345, CSS: 6789 } etc.
 *
 * NOTE: We intentionally call this only for the top-N repos (see metrics.ts)
 * to stay well within GitHub's unauthenticated rate limit of 60 req/hr.
 * Each user analysis consumes ~3 requests (profile + repos + events) plus
 * at most 15 language requests = 18 total.
 */
export async function fetchRepoLanguages(
  owner: string,
  repo: string
): Promise<Record<string, number>> {
  try {
    return await ghFetch<Record<string, number>>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`
    );
  } catch {
    // Tolerate failures on individual repos — language data is best-effort
    return {};
  }
}
