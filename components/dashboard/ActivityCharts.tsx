"use client";

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { ActivityBreakdown } from "@/lib/types";

interface Props {
  activity: ActivityBreakdown;
}

const TOOLTIP_STYLE = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  fontSize: "12px",
  color: "var(--text)",
};

const CARD = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
};

const STAT_ITEMS = [
  { key: "pushEvents",  label: "Pushes",  color: "#34d399" },
  { key: "prEvents",    label: "PRs",     color: "#c084fc" },
  { key: "issueEvents", label: "Issues",  color: "#fbbf24" },
  { key: "total",       label: "Total",   color: "#22d3ee" },
] as const;

export function ActivityCharts({ activity }: Props) {
  const dailyData = activity.daily90.map((d) => ({
    ...d,
    label: fmtDate(d.date),
  }));

  return (
    <div className="space-y-4">
      {/* Daily activity */}
      <div style={CARD} className="p-4 sm:p-5">
        <div style={{ borderBottom: "1px solid var(--border-muted)" }} className="pb-3 mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
            Activity — Last 90 Days
          </h3>
        </div>

        {/* Stat pills — 2x2 on mobile, row on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 mb-5">
          {STAT_ITEMS.map(({ key, label, color }) => (
            <div key={key} className="flex flex-col gap-0.5">
              <span className="text-lg sm:text-xl font-bold" style={{ color }}>
                {activity[key]}
              </span>
              <span className="text-xs" style={{ color: "var(--text-dim)" }}>{label}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "var(--text-dim)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "var(--text-dim)" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={24}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: "var(--text-muted)", marginBottom: 4 }}
              itemStyle={{ color: "#34d399" }}
              formatter={(v) => [v ?? 0, "events"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#34d399", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekday breakdown */}
      <div style={CARD} className="p-4 sm:p-5">
        <div style={{ borderBottom: "1px solid var(--border-muted)" }} className="pb-3 mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
            Activity by Weekday
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={activity.byWeekday} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "var(--text-dim)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "var(--text-dim)" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={24}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: "var(--text-muted)", marginBottom: 4 }}
              itemStyle={{ color: "#c084fc" }}
              formatter={(v) => [v ?? 0, "events"]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32} fill="#c084fc" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function fmtDate(iso: string): string {
  const [, month, day] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
}
