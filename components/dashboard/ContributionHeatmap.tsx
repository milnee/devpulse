"use client";

import { useState } from "react";
import type { DailyActivity } from "@/lib/types";

interface Props {
  daily90: DailyActivity[];
}

// Blue-toned intensity scale matching our theme
function cellColor(count: number): string {
  if (count === 0) return "#1c2128";
  if (count === 1) return "#0d2136";
  if (count <= 3) return "#0c3f6e";
  if (count <= 6) return "#1a5ba8";
  return "#58a6ff";
}

const CARD = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: "12px",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function ContributionHeatmap({ daily90 }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  if (daily90.length === 0) return null;

  // Build a 13-week grid (91 days), aligning to Sunday start
  // Find the Sunday at or before the earliest date
  const first = new Date(daily90[0].date + "T00:00:00Z");
  const startOffset = first.getUTCDay(); // 0=Sun
  const gridStart = new Date(first);
  gridStart.setUTCDate(gridStart.getUTCDate() - startOffset);

  // Map date→count for O(1) lookup
  const countMap: Record<string, number> = {};
  for (const d of daily90) countMap[d.date] = d.count;

  // Build 13 columns × 7 rows
  const weeks: { date: string; count: number }[][] = [];
  for (let w = 0; w < 13; w++) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(gridStart);
      dt.setUTCDate(dt.getUTCDate() + w * 7 + d);
      const iso = dt.toISOString().slice(0, 10);
      week.push({ date: iso, count: countMap[iso] ?? 0 });
    }
    weeks.push(week);
  }

  // Month label positions
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const m = new Date(weeks[w][0].date + "T00:00:00Z").getUTCMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: MONTHS[m], col: w });
      lastMonth = m;
    }
  }

  const totalInPeriod = daily90.reduce((s, d) => s + d.count, 0);

  return (
    <div style={CARD} className="p-4 sm:p-5">
      <div style={{ borderBottom: "1px solid #21262d" }} className="pb-3 mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#484f58" }}>
          Contribution Activity
        </h3>
        <span className="text-xs" style={{ color: "#484f58" }}>
          {totalInPeriod} events · 90 days
        </span>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 560 }}>
          {/* Month labels */}
          <div className="flex mb-1.5" style={{ paddingLeft: 24 }}>
            {weeks.map((_, w) => {
              const label = monthLabels.find((m) => m.col === w);
              return (
                <div key={w} style={{ width: 14, marginRight: 2, flexShrink: 0 }}>
                  {label && (
                    <span className="text-[10px]" style={{ color: "#484f58" }}>
                      {label.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1.5" style={{ paddingTop: 1 }}>
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} style={{ width: 12, height: 12, fontSize: 9, color: "#484f58", lineHeight: "12px", textAlign: "right" }}>
                  {i % 2 === 1 ? d : ""}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    style={{
                      width: 12, height: 12,
                      borderRadius: 3,
                      background: cellColor(cell.count),
                      cursor: cell.count > 0 ? "pointer" : "default",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ date: cell.date, count: cell.count, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-lg text-xs pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 36,
            background: "#1c2128",
            border: "1px solid #30363d",
            color: "#e6edf3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            transform: "translateX(-50%)",
          }}
        >
          <span style={{ color: "#58a6ff" }}>{tooltip.count}</span>{" "}
          event{tooltip.count !== 1 ? "s" : ""} on {tooltip.date}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-1.5 justify-end">
        <span className="text-[10px]" style={{ color: "#484f58" }}>Less</span>
        {[0, 1, 3, 5, 8].map((v) => (
          <div key={v} style={{ width: 10, height: 10, borderRadius: 2, background: cellColor(v), flexShrink: 0 }} />
        ))}
        <span className="text-[10px]" style={{ color: "#484f58" }}>More</span>
      </div>
    </div>
  );
}
