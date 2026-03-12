import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Database, RefreshCw, AlertCircle, Activity, BarChart2, BookOpen, Cpu, Lightbulb, ChevronLeft, GitBranch } from "lucide-react";
import { Suspense } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RepoList } from "@/components/dashboard/RepoList";
import { LanguageChart } from "@/components/dashboard/LanguageChart";
import { ActivityCharts } from "@/components/dashboard/ActivityCharts";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";
import { RefreshButton } from "@/components/dashboard/RefreshButton";
import { RecentCommits } from "@/components/dashboard/RecentCommits";
import { ContributionHeatmap } from "@/components/dashboard/ContributionHeatmap";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TimezoneDetector } from "@/components/TimezoneDetector";
import type { ApiResponse } from "@/lib/types";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tz?: string; nocache?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} · DevPulse`,
    description: `GitHub analytics dashboard for ${username} — repos, languages, activity and insights.`,
  };
}

async function fetchDashboard(username: string, tz?: string): Promise<ApiResponse> {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const url = new URL(`${base}/api/analyze`);
  url.searchParams.set("username", username);
  if (tz) url.searchParams.set("tz", tz);

  const res = await fetch(url.toString(), { cache: "no-store" });
  return res.json() as Promise<ApiResponse>;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] uppercase tracking-widest font-semibold mb-3"
      style={{ color: "var(--text-dim)" }}
    >
      {children}
    </p>
  );
}

const NAV_ITEMS = [
  { href: "#overview",      label: "Overview",      icon: BarChart2  },
  { href: "#activity",      label: "Activity",      icon: Activity   },
  { href: "#repositories",  label: "Repositories",  icon: BookOpen   },
  { href: "#languages",     label: "Languages",     icon: Cpu        },
  { href: "#insights",      label: "Insights",      icon: Lightbulb  },
];

export default async function UserPage({ params, searchParams }: Props) {
  const { username } = await params;
  const { tz } = await searchParams;

  const result = await fetchDashboard(username, tz);

  /* ── Error state ──────────────────────────────────────── */
  if (!result.ok) {
    if (result.code === "NOT_FOUND") notFound();

    const isRateLimited = result.code === "RATE_LIMITED";
    const retryMins = result.retryAfter ? Math.ceil(result.retryAfter / 60) : null;

    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: isRateLimited ? "rgba(255,166,87,0.1)" : "rgba(248,81,73,0.1)",
            border: `1px solid ${isRateLimited ? "rgba(255,166,87,0.2)" : "rgba(248,81,73,0.2)"}`,
          }}
        >
          {isRateLimited
            ? <AlertCircle size={20} style={{ color: "var(--orange)" }} />
            : <RefreshCw size={20} style={{ color: "var(--red)" }} />}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
            {isRateLimited ? "Rate limit reached" : "Something went wrong"}
          </h2>
          <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>{result.error}</p>
          {isRateLimited && retryMins && (
            <p className="text-xs mt-2 font-medium" style={{ color: "var(--orange)" }}>
              ⏱ Try again in ~{retryMins} minute{retryMins !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <SearchForm defaultValue={username} compact />
      </div>
    );
  }

  /* ── Success state ────────────────────────────────────── */
  const { data } = result;
  const cachedDate = new Date(data.cachedAt);
  const tzOffset = Number(tz ?? "0");
  const tzLabel = tz
    ? `UTC${tzOffset >= 0 ? "+" : ""}${Math.floor(tzOffset / 60)}${tzOffset % 60 !== 0 ? `:${Math.abs(tzOffset % 60).toString().padStart(2, "0")}` : ""}`
    : "UTC";

  const quickStats = [
    { label: "Followers",    value: fmt(data.profile.followers),    sub: `${fmt(data.profile.following)} following`  },
    { label: "Repositories", value: fmt(data.profile.public_repos), sub: "public repos"                             },
    { label: "Total Stars",  value: fmt(data.totalStars),           sub: "across all repos"                        },
    { label: "Total Forks",  value: fmt(data.totalForks),           sub: "across all repos"                        },
  ];

  return (
    <div
      className="min-h-[calc(100vh-52px)] p-3 sm:p-4 lg:p-6"
      style={{ background: "var(--bg)" }}
    >
      {!tz && (
        <Suspense>
          <TimezoneDetector />
        </Suspense>
      )}

      {/* ── Outer app container ──────────────────────────── */}
      <div
        className="max-w-6xl mx-auto flex overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          minHeight: "calc(100vh - 52px - 3rem)",
        }}
      >
        {/* ── Sidebar ───────────────────────────────────── */}
        <aside
          className="hidden lg:flex w-[200px] xl:w-[220px] shrink-0 flex-col"
          style={{ borderRight: "1px solid var(--border)" }}
        >
          {/* Brand mark */}
          <div
            className="px-4 py-3.5 flex items-center gap-2"
            style={{ borderBottom: "1px solid var(--border-muted)" }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sb-grad" x1="0" y1="0" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="url(#sb-grad)" />
                <path d="M9 5L13 9L9 13L5 9L9 5Z" fill="var(--bg-card)" opacity="0.6" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                DevPulse
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-0.5 pt-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors sidebar-nav-link"
                style={{ color: "var(--text-muted)" }}
              >
                <Icon size={13} className="shrink-0" />
                {label}
              </a>
            ))}

            <div
              className="mx-3 my-3"
              style={{ height: "1px", background: "var(--border-muted)" }}
            />

            <Link
              href="/compare"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors sidebar-nav-link"
              style={{ color: "var(--text-muted)" }}
            >
              <GitBranch size={13} className="shrink-0" />
              Compare
            </Link>
          </nav>

          {/* User mini profile at bottom */}
          <div
            className="p-4"
            style={{ borderTop: "1px solid var(--border-muted)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div
                  className="absolute inset-0 rounded-full blur-sm"
                  style={{
                    background: "linear-gradient(135deg,#34d399,#c084fc)",
                    transform: "scale(1.15)",
                  }}
                />
                <Image
                  src={data.profile.avatar_url}
                  alt={data.profile.login}
                  width={28}
                  height={28}
                  className="relative rounded-full"
                  style={{ border: "2px solid var(--bg-card)" }}
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>
                  {data.profile.name ?? data.profile.login}
                </p>
                <p className="text-[10px] truncate" style={{ color: "var(--text-dim)" }}>
                  @{data.profile.login}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col">

          {/* Top bar: greeting + actions */}
          <div
            className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3"
            style={{ borderBottom: "1px solid var(--border-muted)" }}
          >
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md"
                style={{ color: "var(--text-dim)", background: "var(--bg-elevated)" }}
              >
                <ChevronLeft size={14} />
              </Link>
              <div>
                <h1 className="text-sm font-semibold leading-none" style={{ color: "var(--text)" }}>
                  @{data.profile.login}
                </h1>
                {data.profile.name && (
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-dim)" }}>
                    {data.profile.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <SearchForm defaultValue={username} compact />
              </div>
              <RefreshButton username={username} />
              <CopyLinkButton />
            </div>
          </div>

          {/* Quick stat cards row */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4"
            style={{ borderBottom: "1px solid var(--border-muted)" }}
          >
            {quickStats.map(({ label, value, sub }, i) => (
              <div
                key={label}
                className="px-4 sm:px-5 py-3.5"
                style={{
                  borderRight: i < 3 ? "1px solid var(--border-muted)" : "none",
                }}
              >
                <p
                  className="text-[9px] uppercase tracking-widest font-semibold mb-1.5"
                  style={{ color: "var(--text-dim)" }}
                >
                  {label}
                </p>
                <p className="text-lg sm:text-xl font-bold leading-none" style={{ color: "var(--text)" }}>
                  {value}
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-dim)" }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 p-4 sm:p-5 space-y-6">

            {/* Mobile search */}
            <div className="sm:hidden">
              <SearchForm defaultValue={username} compact />
            </div>

            {/* Overview */}
            <section id="overview">
              <SectionLabel>Overview</SectionLabel>
              <ProfileCard
                user={data.profile}
                totalStars={data.totalStars}
                totalForks={data.totalForks}
              />
            </section>

            {/* Contribution stats */}
            <section>
              <SectionLabel>Contribution Stats · 90 Days</SectionLabel>
              <StatsGrid activity={data.activity} tzLabel={tzLabel} />
            </section>

            {/* Activity */}
            <section id="activity">
              <SectionLabel>Activity</SectionLabel>
              <div className="space-y-4">
                <ContributionHeatmap
                  daily90={data.activity.daily90}
                  currentStreak={data.activity.currentStreak}
                  longestStreak={data.activity.longestStreak}
                />
                <ActivityCharts activity={data.activity} />
                <RecentCommits commits={data.commits} />
              </div>
            </section>

            {/* Repositories */}
            <section id="repositories">
              <SectionLabel>Repositories</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RepoList title="Most Starred" repos={data.mostStarredRepos} />
                <RepoList title="Recently Updated" repos={data.recentlyUpdatedRepos} />
              </div>
            </section>

            {/* Languages */}
            <section id="languages">
              <SectionLabel>Languages</SectionLabel>
              <LanguageChart languages={data.languages} />
            </section>

            {/* Insights */}
            <section id="insights">
              <SectionLabel>Insights</SectionLabel>
              <InsightsCard insights={data.insights} activity={data.activity} tzLabel={tzLabel} />
            </section>

            {/* Footer */}
            <div
              className="pt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs"
              style={{ borderTop: "1px solid var(--border-muted)", color: "var(--text-dim)" }}
            >
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                Cached{" "}
                {cachedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Database size={11} />
                Public GitHub API
              </span>
              <span>🕐 Streaks in {tzLabel}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
