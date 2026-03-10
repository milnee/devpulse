"use client";

import {
  TrendingUp, TrendingDown, Minus,
  Code2, Flame, GitCommitHorizontal,
} from "lucide-react";
import type { Insights } from "@/lib/types";

interface Props {
  insights: Insights;
}

const CARD = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: "12px",
};

export function InsightsCard({ insights }: Props) {
  const trend = insights.activityTrend;

  const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus;
  const trendColor = trend > 5 ? "#3fb950" : trend < -5 ? "#f85149" : "#484f58";
  const trendLabel =
    trend > 5
      ? `+${trend}% vs previous 30 days`
      : trend < -5
      ? `${trend}% vs previous 30 days`
      : "Similar to previous 30 days";

  const bullets = [
    {
      icon: <Flame size={14} style={{ color: "#ffa657" }} className="shrink-0 mt-0.5" />,
      bg: "rgba(255,166,87,0.08)",
      text: insights.mostActiveRepo
        ? `Most active: ${insights.mostActiveRepo}`
        : "No recent repository activity.",
    },
    {
      icon: <Code2 size={14} style={{ color: "#58a6ff" }} className="shrink-0 mt-0.5" />,
      bg: "rgba(88,166,255,0.08)",
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
          style={{ color: "#a371f7" }}
          className="shrink-0 mt-0.5"
        />
      ),
      bg: "rgba(163,113,247,0.08)",
      text: `~${insights.totalCommitsEstimate} commit${insights.totalCommitsEstimate !== 1 ? "s" : ""} in recent events`,
    },
  ];

  return (
    <div style={CARD} className="p-5">
      <div style={{ borderBottom: "1px solid #21262d" }} className="pb-3 mb-4">
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#484f58" }}
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
            <p className="text-sm leading-snug" style={{ color: "#8b949e" }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
