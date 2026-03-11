import { NextRequest, NextResponse } from "next/server";
import { parseUsername } from "@/lib/validate";
import { fetchUser, fetchRepos, fetchEvents } from "@/lib/github-client";
import { computeDashboard } from "@/lib/metrics";
import { cacheGet, cacheSet } from "@/lib/cache";
import type { ApiResponse } from "@/lib/types";

export const runtime = "nodejs"; // needs Node.js for optional mysql2

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const searchParams = request.nextUrl.searchParams;
  const raw = searchParams.get("username") ?? "";

  // ── 1. Validate input ──────────────────────────────────────────────────────
  const parsed = parseUsername(raw);
  if ("error" in parsed) {
    return NextResponse.json(
      { ok: false, error: parsed.error, code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  const { username } = parsed;
  const nocache = searchParams.get("nocache") === "1";

  // Parse optional timezone offset (minutes east of UTC)
  const tzParam = searchParams.get("tz");
  const tzOffsetMin = tzParam ? parseInt(tzParam, 10) : 0;
  const validTz = Number.isFinite(tzOffsetMin) && tzOffsetMin >= -840 && tzOffsetMin <= 840
    ? tzOffsetMin
    : 0;

  // ── 2. Check cache ─────────────────────────────────────────────────────────
  // Cache key includes tz offset so timezone-aware results are cached separately
  const cacheKey = validTz !== 0 ? `${username}:tz${validTz}` : username;
  try {
    const cached = !nocache && await cacheGet(cacheKey);
    if (cached) {
      return NextResponse.json(
        { ok: true, data: cached },
        {
          headers: {
            "X-Cache": "HIT",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
          },
        }
      );
    }
  } catch (e) {
    // Cache failure is non-fatal — proceed with fresh fetch
    console.warn("[analyze] cache read error:", e);
  }

  // ── 3. Fetch from GitHub ───────────────────────────────────────────────────
  try {
    const [user, repos, events] = await Promise.all([
      fetchUser(username),
      fetchRepos(username),
      fetchEvents(username),
    ]);

    // ── 4. Compute metrics ─────────────────────────────────────────────────
    const data = await computeDashboard(user, repos, events, validTz);

    // ── 5. Store in cache (fire-and-forget, don't block response) ──────────
    cacheSet(cacheKey, data).catch((e) =>
      console.warn("[analyze] cache write error:", e)
    );

    return NextResponse.json(
      { ok: true, data },
      {
        headers: {
          "X-Cache": "MISS",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err: unknown) {
    const e = err as Error & { code?: string; retryAfter?: number };

    if (e.code === "NOT_FOUND") {
      return NextResponse.json(
        {
          ok: false,
          error: `GitHub user "${username}" was not found. Check the spelling and try again.`,
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (e.code === "RATE_LIMITED") {
      const retryAfter = e.retryAfter;
      const waitMsg = retryAfter
        ? ` Try again in ${Math.ceil(retryAfter / 60)} minute${Math.ceil(retryAfter / 60) !== 1 ? "s" : ""}.`
        : " Try again in a few minutes.";
      return NextResponse.json(
        {
          ok: false,
          error: `GitHub API rate limit reached.${waitMsg}`,
          code: "RATE_LIMITED",
          retryAfter,
        },
        { status: 429 }
      );
    }

    console.error("[analyze] unexpected error:", e);
    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while fetching data. Please try again.",
        code: "UNKNOWN",
      },
      { status: 500 }
    );
  }
}
