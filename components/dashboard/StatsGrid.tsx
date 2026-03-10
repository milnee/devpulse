"use client";

import type { ActivityBreakdown } from "@/lib/types";

interface Props {
  activity: ActivityBreakdown;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function fmtHour(h: number): string {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

const CARD = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: "12px",
};

const STATS = [
  { key: "prOpened"     as const, label: "Pull Requests", sub: "opened",     color: "#a371f7" },
  { key: "issuesOpened" as const, label: "Issues",        sub: "opened",     color: "#ffa657" },
  { key: "codeReviews"  as const, label: "Code Reviews",  sub: "given",      color: "#58a6ff" },
  { key: "contributedTo"as const, label: "Contributed To",sub: "repos",      color: "#3fb950" },
];

export function StatsGrid({ activity }: Props) {
  const hasLines = activity.linesAdded > 0 || activity.linesDeleted > 0;

  return (
    <div style={CARD} className="p-4 sm:p-5">
      {/* Header */}
      <div
        className="pb-3 mb-4 flex flex-wrap items-center justify-between gap-2"
        style={{ borderBottom: "1px solid #21262d" }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#484f58" }}>
          Contribution Stats · 90 Days
        </h3>
        {hasLines && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span style={{ color: "#3fb950" }}>+{fmt(activity.linesAdded)}</span>
            <span style={{ color: "#484f58" }}>/</span>
            <span style={{ color: "#f85149" }}>−{fmt(activity.linesDeleted)}</span>
            <span style={{ color: "#484f58" }}>lines</span>
          </div>
        )}
      </div>

      {/* 4 stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {STATS.map(({ key, label, sub, color }) => (
          <div key={key} className="flex flex-col gap-0.5">
            <span
              className="text-2xl sm:text-3xl font-bold leading-none"
              style={{ color }}
            >
              {fmt(activity[key])}
            </span>
            <span className="text-xs font-medium mt-1" style={{ color: "#e6edf3" }}>
              {label}
            </span>
            <span className="text-[10px]" style={{ color: "#484f58" }}>
              {sub} · last 90d
            </span>
          </div>
        ))}
      </div>

      {/* Work patterns row */}
      {(activity.mostActiveDay || activity.peakHour !== undefined) && (
        <div
          className="mt-4 pt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs"
          style={{ borderTop: "1px solid #21262d", color: "#484f58" }}
        >
          <span>
            Most active day:{" "}
            <span style={{ color: "#8b949e" }}>{activity.mostActiveDay}</span>
          </span>
          <span>
            Peak hour:{" "}
            <span style={{ color: "#8b949e" }}>{fmtHour(activity.peakHour)} UTC</span>
          </span>
        </div>
      )}
    </div>
  );
}
