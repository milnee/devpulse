/**
 * Core analytics logic shared between server components and the API route.
 * Server components call this directly to avoid self-HTTP-fetches on Vercel.
 */

import { parseUsername } from "./validate";
import { fetchUser, fetchRepos, fetchEvents } from "./github-client";
import { computeDashboard } from "./metrics";
import { cacheGet, cacheSet } from "./cache";
import type { ApiResponse } from "./types";

export async function getDashboard(
  rawUsername: string,
  options: { tz?: number; nocache?: boolean } = {}
): Promise<ApiResponse> {
  const parsed = parseUsername(rawUsername);
  if ("error" in parsed) {
    return { ok: false, error: parsed.error, code: "INVALID_INPUT" };
  }

  const { username } = parsed;
  const { nocache = false } = options;

  const tzOffsetMin = options.tz ?? 0;
  const validTz =
    Number.isFinite(tzOffsetMin) && tzOffsetMin >= -840 && tzOffsetMin <= 840
      ? tzOffsetMin
      : 0;

  const cacheKey = validTz !== 0 ? `${username}:tz${validTz}` : username;

  // Cache check
  try {
    const cached = !nocache && (await cacheGet(cacheKey));
    if (cached) return { ok: true, data: cached };
  } catch (e) {
    console.warn("[analyze] cache read error:", e);
  }

  // Fetch from GitHub
  try {
    const [user, repos, events] = await Promise.all([
      fetchUser(username),
      fetchRepos(username),
      fetchEvents(username),
    ]);

    const data = await computeDashboard(user, repos, events, validTz);

    cacheSet(cacheKey, data).catch((e) =>
      console.warn("[analyze] cache write error:", e)
    );

    return { ok: true, data };
  } catch (err: unknown) {
    const e = err as Error & { code?: string; retryAfter?: number };

    if (e.code === "NOT_FOUND") {
      return {
        ok: false,
        error: `GitHub user "${username}" was not found. Check the spelling and try again.`,
        code: "NOT_FOUND",
      };
    }

    if (e.code === "RATE_LIMITED") {
      const retryAfter = e.retryAfter;
      const waitMsg = retryAfter
        ? ` Try again in ${Math.ceil(retryAfter / 60)} minute${Math.ceil(retryAfter / 60) !== 1 ? "s" : ""}.`
        : " Try again in a few minutes.";
      return {
        ok: false,
        error: `GitHub API rate limit reached.${waitMsg}`,
        code: "RATE_LIMITED",
        retryAfter,
      };
    }

    console.error("[analyze] unexpected error:", e);
    return {
      ok: false,
      error: "Something went wrong while fetching data. Please try again.",
      code: "UNKNOWN",
    };
  }
}
