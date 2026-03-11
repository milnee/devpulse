"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { LanguageEntry } from "@/lib/types";

interface Props {
  languages: LanguageEntry[];
}

const CARD = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
};

const TOOLTIP_STYLE = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  fontSize: "12px",
  color: "var(--text)",
};

export function LanguageChart({ languages }: Props) {
  return (
    <div style={CARD} className="p-5">
      <div style={{ borderBottom: "1px solid var(--border-muted)" }} className="pb-3 mb-4">
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-dim)" }}
        >
          Languages
        </h3>
      </div>

      {languages.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: "var(--text-dim)" }}>
          No language data available.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={languages}
                dataKey="bytes"
                nameKey="language"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={42}
                paddingAngle={2}
                strokeWidth={0}
              >
                {languages.map((entry) => (
                  <Cell key={entry.language} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ display: "none" }}
                formatter={(value, name) => {
                  const entry = languages.find((l) => l.language === String(name));
                  return [`${entry?.percentage ?? 0}%`, String(name)];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Percentage bars */}
          <div className="mt-3 space-y-2">
            {languages.slice(0, 6).map((lang) => (
              <div key={lang.language} className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: lang.color }}
                />
                <span className="text-xs w-20 truncate" style={{ color: "var(--text-muted)" }}>
                  {lang.language}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--border-muted)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${lang.percentage}%`,
                      background: lang.color,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <span className="text-xs w-9 text-right" style={{ color: "var(--text-dim)" }}>
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
