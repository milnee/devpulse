import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Database, RefreshCw } from "lucide-react";
import { SearchForm } from "@/components/SearchForm";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RepoList } from "@/components/dashboard/RepoList";
import { LanguageChart } from "@/components/dashboard/LanguageChart";
import { ActivityCharts } from "@/components/dashboard/ActivityCharts";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";
import type { ApiResponse } from "@/lib/types";

interface Props {
  params: Promise<{ username: string }>;
}

export const revalidate = 21600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} · DevPulse`,
    description: `GitHub analytics dashboard for ${username} — repos, languages, activity and insights.`,
  };
}

async function fetchDashboard(username: string): Promise<ApiResponse> {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const res = await fetch(
    `${base}/api/analyze?username=${encodeURIComponent(username)}`,
    { next: { revalidate: 21600 } }
  );
  return res.json() as Promise<ApiResponse>;
}

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const result = await fetchDashboard(username);

  if (!result.ok) {
    if (result.code === "NOT_FOUND") notFound();

    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.2)" }}
        >
          <RefreshCw size={20} style={{ color: "#f85149" }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "#e6edf3" }}>
            {result.code === "RATE_LIMITED" ? "Rate limit reached" : "Something went wrong"}
          </h2>
          <p className="text-sm max-w-sm" style={{ color: "#8b949e" }}>{result.error}</p>
        </div>
        <SearchForm defaultValue={username} compact />
      </div>
    );
  }

  const { data } = result;
  const cachedDate = new Date(data.cachedAt);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <SearchForm defaultValue={username} compact />
        <CopyLinkButton />
      </div>

      {/* Profile */}
      <ProfileCard
        user={data.profile}
        totalStars={data.totalStars}
        totalForks={data.totalForks}
      />

      {/* Main grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          <ActivityCharts activity={data.activity} />
          <div className="grid sm:grid-cols-2 gap-5">
            <RepoList title="Most Starred" repos={data.mostStarredRepos} />
            <RepoList title="Recently Updated" repos={data.recentlyUpdatedRepos} />
          </div>
        </div>

        {/* Right: 1/3 */}
        <div className="space-y-5">
          <InsightsCard insights={data.insights} />
          <LanguageChart languages={data.languages} />
        </div>
      </div>

      {/* Footer meta */}
      <div
        className="mt-8 pt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs"
        style={{ borderTop: "1px solid #21262d", color: "#484f58" }}
      >
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          Cached{" "}
          {cachedDate.toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <Database size={11} />
          Public GitHub API
        </span>
      </div>
    </div>
  );
}
