"use client";

import { GitCommitHorizontal, ExternalLink } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import type { CommitSummary } from "@/lib/types";

interface Props {
  commits: CommitSummary[];
}

const CARD = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
};

export function RecentCommits({ commits }: Props) {
  return (
    <div style={CARD} className="p-4 sm:p-5">
      <div style={{ borderBottom: "1px solid var(--border-muted)" }} className="pb-3 mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
          Recent Commits
        </h3>
      </div>

      {commits.length === 0 ? (
        <p className="text-sm py-2 text-center" style={{ color: "var(--text-dim)" }}>
          No public commits found in recent events.
        </p>
      ) : (
        <div className="space-y-0">
          {commits.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-2.5 group"
              style={{ borderBottom: i < commits.length - 1 ? "1px solid var(--border-muted)" : "none" }}
            >
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                <GitCommitHorizontal size={14} style={{ color: "var(--text-dim)" }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-snug truncate"
                  style={{ color: "var(--text)" }}
                  title={c.message}
                >
                  {c.message}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={c.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-xs transition-colors"
                    style={{ color: "#58a6ff" }}
                  >
                    {c.repo}
                    <ExternalLink size={10} />
                  </a>
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {timeAgo(c.pushedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
