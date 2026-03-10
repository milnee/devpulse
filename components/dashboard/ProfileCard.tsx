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
    { icon: Star,     label: "Total Stars", value: fmt(totalStars) },
    { icon: GitFork,  label: "Total Forks", value: fmt(totalForks) },
  ];

  return (
    <div style={CARD} className="p-6">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Avatar with gradient ring */}
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
            width={88}
            height={88}
            className="relative rounded-full"
            style={{ border: "3px solid #0d1117" }}
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h2 className="text-xl font-bold truncate" style={{ color: "#e6edf3" }}>
              {user.name ?? user.login}
            </h2>
            <span className="text-sm" style={{ color: "#8b949e" }}>@{user.login}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "rgba(88,166,255,0.1)",
                border: "1px solid rgba(88,166,255,0.2)",
                color: "#58a6ff",
              }}
            >
              Joined {joined}
            </span>
          </div>

          {user.bio && (
            <p className="text-sm mb-3 leading-relaxed" style={{ color: "#8b949e" }}>
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs" style={{ color: "#484f58" }}>
            {user.company && (
              <span className="flex items-center gap-1.5" style={{ color: "#8b949e" }}>
                <Building2 size={12} />
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1.5" style={{ color: "#8b949e" }}>
                <MapPin size={12} />
                {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors"
                style={{ color: "#58a6ff" }}
              >
                <Link2 size={12} />
                {user.blog}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="mt-5 pt-5 grid grid-cols-2 sm:grid-cols-5 gap-4"
        style={{ borderTop: "1px solid #21262d" }}
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1">
            <Icon size={13} style={{ color: "#484f58" }} />
            <span className="text-lg font-bold" style={{ color: "#e6edf3" }}>{value}</span>
            <span className="text-xs" style={{ color: "#484f58" }}>{label}</span>
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
