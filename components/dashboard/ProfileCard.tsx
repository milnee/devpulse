"use client";

import Image from "next/image";
import { MapPin, Link2, Building2, Users, BookOpen, Star, GitFork } from "lucide-react";
import type { GitHubUser } from "@/lib/types";

interface Props {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
}

const CARD = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: "12px",
};

export function ProfileCard({ user, totalStars, totalForks }: Props) {
  const joined = new Date(user.created_at).getFullYear();

  const stats = [
    { icon: Users,    label: "Followers",   value: fmt(user.followers) },
    { icon: Users,    label: "Following",   value: fmt(user.following) },
    { icon: BookOpen, label: "Repos",       value: fmt(user.public_repos) },
    { icon: Star,     label: "Stars",       value: fmt(totalStars) },
    { icon: GitFork,  label: "Forks",       value: fmt(totalForks) },
  ];

  return (
    <div style={CARD} className="p-4 sm:p-6">
      {/* Top section: avatar + info side by side on all sizes */}
      <div className="flex flex-row gap-4 items-start">
        {/* Avatar */}
        <div className="shrink-0 relative">
          <div
            className="absolute inset-0 rounded-full blur-sm"
            style={{
              background: "linear-gradient(135deg,#58a6ff,#a371f7)",
              transform: "scale(1.08)",
            }}
          />
          <Image
            src={user.avatar_url}
            alt={user.login}
            width={72}
            height={72}
            className="relative rounded-full sm:w-[88px] sm:h-[88px]"
            style={{ border: "3px solid #0d1117", width: 72, height: 72 }}
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <h2 className="text-base sm:text-xl font-bold truncate" style={{ color: "#e6edf3" }}>
              {user.name ?? user.login}
            </h2>
            <span className="text-xs sm:text-sm" style={{ color: "#8b949e" }}>
              @{user.login}
            </span>
          </div>

          {/* Joined badge */}
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-2"
            style={{
              background: "rgba(88,166,255,0.1)",
              border: "1px solid rgba(88,166,255,0.2)",
              color: "#58a6ff",
            }}
          >
            Joined {joined}
          </span>

          {/* Bio — hidden on very small, shown on sm+ */}
          {user.bio && (
            <p className="hidden sm:block text-sm leading-relaxed mb-2" style={{ color: "#8b949e" }}>
              {user.bio}
            </p>
          )}

          {/* Meta links */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {user.company && (
              <span className="flex items-center gap-1" style={{ color: "#8b949e" }}>
                <Building2 size={11} />{user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1" style={{ color: "#8b949e" }}>
                <MapPin size={11} />{user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
                style={{ color: "#58a6ff" }}
              >
                <Link2 size={11} />
                <span className="truncate max-w-[120px]">{user.blog}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bio on mobile (below avatar row) */}
      {user.bio && (
        <p className="sm:hidden mt-3 text-sm leading-relaxed" style={{ color: "#8b949e" }}>
          {user.bio}
        </p>
      )}

      {/* Stats grid */}
      <div
        className="mt-4 pt-4 grid grid-cols-5 gap-2"
        style={{ borderTop: "1px solid #21262d" }}
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1">
            <Icon size={12} style={{ color: "#484f58" }} />
            <span className="text-sm sm:text-lg font-bold leading-none" style={{ color: "#e6edf3" }}>
              {value}
            </span>
            <span className="text-[10px] sm:text-xs leading-tight" style={{ color: "#484f58" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
