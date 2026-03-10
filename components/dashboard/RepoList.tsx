"use client";

import { Star, GitFork, ExternalLink } from "lucide-react";
import type { RepoSummary } from "@/lib/types";

interface Props {
  title: string;
  repos: RepoSummary[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", "C#": "#178600", Ruby: "#701516", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", HTML: "#e34c26", CSS: "#563d7c",
  Shell: "#89e051", Vue: "#41b883", Svelte: "#ff3e00",
};

export function RepoList({ title, repos }: Props) {
  return (
    <div
      className="rounded-xl"
      style={{ background: "#161b22", border: "1px solid #30363d" }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid #21262d" }}>
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#484f58" }}>
          {title}
        </h3>
      </div>

      <div className="p-3 space-y-1">
        {repos.length === 0 && (
          <p className="text-sm px-2 py-3" style={{ color: "#484f58" }}>
            No repositories found.
          </p>
        )}
        {repos.map((repo) => (
          <div
            key={repo.full_name}
            className="flex items-start justify-between gap-3 px-2 py-2.5 rounded-lg transition-colors group"
            style={{ borderRadius: "8px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1c2128")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="min-w-0 flex-1">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors truncate"
                style={{ color: "#e6edf3" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#58a6ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#e6edf3")}
              >
                {repo.name}
                <ExternalLink size={10} style={{ color: "#484f58" }} />
              </a>
              {repo.description && (
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#8b949e" }}>
                  {repo.description}
                </p>
              )}
              {repo.language && (
                <div className="flex items-center gap-1 mt-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: LANG_COLORS[repo.language] ?? "#8b949e" }}
                  />
                  <span className="text-xs" style={{ color: "#8b949e" }}>
                    {repo.language}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs shrink-0" style={{ color: "#484f58" }}>
              <span className="flex items-center gap-0.5">
                <Star size={11} />
                {repo.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5">
                <GitFork size={11} />
                {repo.forks.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
