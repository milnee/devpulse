"use client";

import {
  TrendingUp, TrendingDown, Minus,
  Code2, Flame, GitCommitHorizontal, Clock,
} from "lucide-react";
import type { Insights, ActivityBreakdown } from "@/lib/types";

interface Props {
  insights: Insights;
  activity: ActivityBreakdown;
  tzLabel?: string;
}

const CARD = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
};

function fmtHour(h: number): string {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

export function InsightsCard({ insights, activity, tzLabel = "UTC" }: Props) {
  const trend = insights.activityTrend;

  const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus;
  const trendColor = trend > 5 ? "#22d3ee" : trend < -5 ? "var(--red)" : "var(--text-dim)";
  const trendLabel =
    trend > 5
      ? `+${trend}% vs previous 30 days`
      : trend < -5
      ? `${trend}% vs previous 30 days`
      : "Similar to previous 30 days";

  const bullets = [
    {
      icon: <Flame size={14} style={{ color: "#fbbf24" }} className="shrink-0 mt-0.5" />,
      bg: "rgba(251,191,36,0.08)",
      text: insights.mostActiveRepo
        ? `Most active: ${insights.mostActiveRepo}`
        : "No recent repository activity.",
    },
    {
      icon: <Code2 size={14} style={{ color: "#34d399" }} className="shrink-0 mt-0.5" />,
      bg: "rgba(52,211,153,0.08)",
      text: insights.mostUsedLanguage
        ? `Primary language: ${insights.mostUsedLanguage}`
        : "No language data available.",
    },
    {
      icon: (
        <TrendIcon
          size={14}
          style={{ color: trendColor }}
          className="shrink-0 mt-0.5"
        />
      ),
      bg: `rgba(${trend > 5 ? "63,185,80" : trend < -5 ? "248,81,73" : "72,79,88"},0.08)`,
      text: trendLabel,
    },
    {
      icon: (
        <GitCommitHorizontal
          size={14}
          style={{ color: "#c084fc" }}
          className="shrink-0 mt-0.5"
        />
      ),
      bg: "rgba(192,132,252,0.08)",
      text: `~${insights.totalCommitsEstimate} commit${insights.totalCommitsEstimate !== 1 ? "s" : ""} in recent events`,
    },
    {
      icon: <Clock size={14} style={{ color: "#22d3ee" }} className="shrink-0 mt-0.5" />,
      bg: "rgba(34,211,238,0.08)",
      text: `Most active ${activity.mostActiveDay}s · peak around ${fmtHour(activity.peakHour)} ${tzLabel}`,
    },
  ];

  return (
    <div style={CARD} className="p-5">
      <div style={{ borderBottom: "1px solid var(--border-muted)" }} className="pb-3 mb-4">
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-dim)" }}
        >
          Insights
        </h3>
      </div>

      <div className="space-y-2.5">
        {bullets.map(({ icon, bg, text }, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
            style={{ background: bg }}
          >
            {icon}
            <p className="text-sm leading-snug" style={{ color: "var(--text-muted)" }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
