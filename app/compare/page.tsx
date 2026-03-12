import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CompareForm } from "@/components/compare/CompareForm";
import type { ApiResponse, DashboardData } from "@/lib/types";

export const metadata: Metadata = {
  title: "Compare Developers · DevPulse",
  description: "Side-by-side comparison of any two GitHub developers.",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ a?: string; b?: string }>;
}

async function fetchUser(username: string): Promise<ApiResponse> {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const res = await fetch(`${base}/api/analyze?username=${encodeURIComponent(username)}`, { cache: "no-store" });
  return res.json() as Promise<ApiResponse>;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function TrendBadge({ value }: { value: number }) {
  const Icon = value > 5 ? TrendingUp : value < -5 ? TrendingDown : Minus;
  const color = value > 5 ? "var(--green)" : value < -5 ? "var(--red)" : "var(--text-dim)";
  return (
    <span className="flex items-center gap-1" style={{ color }}>
      <Icon size={12} />
      {value > 0 ? `+${value}%` : `${value}%`}
    </span>
  );
}

interface StatRowProps {
  label: string;
  aVal: string | number;
  bVal: string | number;
  aRaw?: number;
  bRaw?: number;
}

function StatRow({ label, aVal, bVal, aRaw, bRaw }: StatRowProps) {
  const aWins = aRaw !== undefined && bRaw !== undefined && aRaw > bRaw;
  const bWins = aRaw !== undefined && bRaw !== undefined && bRaw > aRaw;
  return (
    <div className="flex items-center py-3" style={{ borderBottom: "1px solid var(--border-muted)" }}>
      <span className="flex-1 text-right text-sm font-semibold" style={{ color: aWins ? "var(--accent)" : "var(--text)" }}>
        {aWins && <span className="text-[10px] mr-1" style={{ color: "var(--accent)" }}>▲</span>}
        {fmt(Number(aVal))}
      </span>
      <span className="w-44 text-center text-xs px-2" style={{ color: "var(--text-dim)" }}>{label}</span>
      <span className="flex-1 text-left text-sm font-semibold" style={{ color: bWins ? "#c084fc" : "var(--text)" }}>
        {fmt(Number(bVal))}
        {bWins && <span className="text-[10px] ml-1" style={{ color: "#c084fc" }}>▲</span>}
      </span>
    </div>
  );
}

function UserHeader({ data, side }: { data: DashboardData; side: "a" | "b" }) {
  const accentColor = side === "a" ? "var(--accent)" : "#c084fc";
  const gradientBg =
    side === "a"
      ? "linear-gradient(135deg,rgba(52,211,153,0.08),rgba(52,211,153,0.02))"
      : "linear-gradient(135deg,rgba(192,132,252,0.08),rgba(192,132,252,0.02))";
  return (
    <div
      className="flex-1 rounded-xl p-4 sm:p-5 flex flex-col items-center text-center gap-3"
      style={{ background: gradientBg, border: `1px solid ${accentColor}30` }}
    >
      <Image
        src={data.profile.avatar_url}
        alt={data.profile.login}
        width={72}
        height={72}
        className="rounded-full"
        style={{ border: `3px solid ${accentColor}` }}
        unoptimized
      />
      <div>
        <a
          href={data.profile.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-bold hover:underline"
          style={{ color: "var(--text)" }}
        >
          {data.profile.name ?? data.profile.login}
        </a>
        <p className="text-xs mt-0.5" style={{ color: accentColor }}>
          @{data.profile.login}
        </p>
        {data.profile.bio && (
          <p className="text-xs mt-1.5 line-clamp-2 max-w-[180px]" style={{ color: "var(--text-muted)" }}>
            {data.profile.bio}
          </p>
        )}
        {data.profile.location && (
          <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
            📍 {data.profile.location}
          </p>
        )}
      </div>
      {data.languages[0] && (
        <div
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
          style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: data.languages[0].color }} />
          {data.languages[0].language}
        </div>
      )}
    </div>
  );
}

export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = await searchParams;
  let resultA: ApiResponse | null = null;
  let resultB: ApiResponse | null = null;
  if (a && b) [resultA, resultB] = await Promise.all([fetchUser(a), fetchUser(b)]);
  const dataA = resultA?.ok ? resultA.data : null;
  const dataB = resultB?.ok ? resultB.data : null;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs mb-4 transition-colors"
          style={{ color: "var(--text-dim)" }}
        >
          ← Home
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(52,211,153,0.1)" }}
          >
            <ArrowLeftRight size={16} style={{ color: "var(--accent)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Compare Developers
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Side-by-side GitHub analytics comparison
        </p>
      </div>

      <CompareForm defaultA={a} defaultB={b} />

      {resultA && !resultA.ok && (
        <div
          className="mb-4 p-3 rounded-xl text-sm"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--red)" }}
        >
          <strong>{a}:</strong> {resultA.error}
        </div>
      )}
      {resultB && !resultB.ok && (
        <div
          className="mb-4 p-3 rounded-xl text-sm"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--red)" }}
        >
          <strong>{b}:</strong> {resultB.error}
        </div>
      )}

      {dataA && dataB && (
        <div className="space-y-5">
          {/* Profile headers */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <UserHeader data={dataA} side="a" />
            <div className="flex items-center justify-center shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-dim)" }}
              >
                VS
              </div>
            </div>
            <UserHeader data={dataB} side="b" />
          </div>

          {/* Stats table */}
          <div className="rounded-xl p-4 sm:p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div
              className="pb-3 mb-1 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border-muted)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Head-to-Head
              </span>
              <div className="flex gap-6 text-xs font-semibold">
                <span style={{ color: "var(--accent)" }}>@{dataA.username}</span>
                <span style={{ color: "#c084fc" }}>@{dataB.username}</span>
              </div>
            </div>
            <StatRow label="Total Stars"           aVal={dataA.totalStars}                    bVal={dataB.totalStars}                    aRaw={dataA.totalStars}         bRaw={dataB.totalStars} />
            <StatRow label="Followers"              aVal={dataA.profile.followers}             bVal={dataB.profile.followers}             aRaw={dataA.profile.followers}  bRaw={dataB.profile.followers} />
            <StatRow label="Public Repos"           aVal={dataA.profile.public_repos}          bVal={dataB.profile.public_repos}          aRaw={dataA.profile.public_repos} bRaw={dataB.profile.public_repos} />
            <StatRow label="PRs Opened (90d)"       aVal={dataA.activity.prOpened}             bVal={dataB.activity.prOpened}             aRaw={dataA.activity.prOpened}  bRaw={dataB.activity.prOpened} />
            <StatRow label="Issues Opened (90d)"    aVal={dataA.activity.issuesOpened}         bVal={dataB.activity.issuesOpened}         aRaw={dataA.activity.issuesOpened} bRaw={dataB.activity.issuesOpened} />
            <StatRow label="Code Reviews (90d)"     aVal={dataA.activity.codeReviews}          bVal={dataB.activity.codeReviews}          aRaw={dataA.activity.codeReviews} bRaw={dataB.activity.codeReviews} />
            <StatRow label="Commits Est. (90d)"     aVal={dataA.insights.totalCommitsEstimate} bVal={dataB.insights.totalCommitsEstimate} aRaw={dataA.insights.totalCommitsEstimate} bRaw={dataB.insights.totalCommitsEstimate} />
            <StatRow label="Current Streak (days)"  aVal={dataA.activity.currentStreak}        bVal={dataB.activity.currentStreak}        aRaw={dataA.activity.currentStreak} bRaw={dataB.activity.currentStreak} />
            <div className="flex items-center py-3">
              <span className="flex-1 flex justify-end">
                <TrendBadge value={dataA.insights.activityTrend} />
              </span>
              <span className="w-44 text-center text-xs px-2" style={{ color: "var(--text-dim)" }}>
                Activity Trend
              </span>
              <span className="flex-1 flex justify-start">
                <TrendBadge value={dataB.insights.activityTrend} />
              </span>
            </div>
          </div>

          {/* Language comparison */}
          {(dataA.languages.length > 0 || dataB.languages.length > 0) && (
            <div className="rounded-xl p-4 sm:p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h3
                className="text-xs font-semibold uppercase tracking-widest pb-3 mb-4"
                style={{ borderBottom: "1px solid var(--border-muted)", color: "var(--text-dim)" }}
              >
                Top Languages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(
                  [
                    { data: dataA, label: dataA.username, color: "var(--accent)" },
                    { data: dataB, label: dataB.username, color: "#c084fc" },
                  ] as { data: DashboardData; label: string; color: string }[]
                ).map(({ data, label, color }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold mb-3" style={{ color }}>
                      @{label}
                    </p>
                    <div className="space-y-2">
                      {data.languages.slice(0, 5).map((lang) => (
                        <div key={lang.language} className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: lang.color }} />
                          <span className="text-xs w-20 truncate" style={{ color: "var(--text-muted)" }}>
                            {lang.language}
                          </span>
                          <div
                            className="flex-1 h-1.5 rounded-full overflow-hidden"
                            style={{ background: "var(--border-muted)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${lang.percentage}%`, background: lang.color }}
                            />
                          </div>
                          <span className="text-xs w-9 text-right" style={{ color: "var(--text-dim)" }}>
                            {lang.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View full profiles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {(
              [
                { username: dataA.username, color: "var(--accent)", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
                { username: dataB.username, color: "#c084fc", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)" },
              ] as { username: string; color: string; bg: string; border: string }[]
            ).map(({ username, color, bg, border }) => (
              <a
                key={username}
                href={`/u/${username}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ background: bg, border: `1px solid ${border}`, color }}
              >
                View full profile for @{username} →
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!a && !b && (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <ArrowLeftRight size={32} className="mx-auto mb-3" style={{ color: "var(--text-dim)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enter two GitHub usernames above to compare them side-by-side.
          </p>
        </div>
      )}
    </div>
  );
}
