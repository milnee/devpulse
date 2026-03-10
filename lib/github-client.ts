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
    const err = new Error("GitHub API rate limit exceeded") as Error & { code: string };
    err.code = "RATE_LIMITED";
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
 * Fetch up to 100 public events for a user (GitHub caps at 300 total).
 * Covers roughly the last 30–90 days of activity.
 */
export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  return ghFetch<GitHubEvent[]>(
    `/users/${encodeURIComponent(username)}/events/public?per_page=100`
  );
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
