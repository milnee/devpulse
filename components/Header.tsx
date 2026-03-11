"use client";

import Link from "next/link";
import { Github, ArrowLeftRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl"
      style={{
        borderBottom: "1px solid var(--border-muted)",
        backgroundColor: "color-mix(in srgb, var(--bg) 80%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[52px] flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          style={{ color: "var(--text)" }}
        >
          {/* Icon mark — small gradient diamond */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#58a6ff"/>
                <stop offset="100%" stopColor="#a371f7"/>
              </linearGradient>
            </defs>
            <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="url(#logo-grad)"/>
            <path d="M9 5L13 9L9 13L5 9L9 5Z" fill="var(--bg)" opacity="0.6"/>
          </svg>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            DevPulse
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center" style={{ gap: "2px" }}>
          <NavLink href="/compare">
            <ArrowLeftRight size={12} className="shrink-0" />
            <span className="hidden sm:inline">Compare</span>
          </NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink
            href="https://github.com/milnee/devpulse"
            external
          >
            <Github size={13} className="shrink-0" />
            <span className="hidden sm:inline">GitHub</span>
          </NavLink>

          {/* Divider */}
          <div
            className="mx-2 h-4 w-px shrink-0"
            style={{ background: "var(--border)" }}
          />

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    "nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors";
  const style = { color: "var(--text-muted)" };
  const hover = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.color = "var(--text)";
      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-elevated)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
    },
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style} {...hover}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} style={style} {...hover}>
      {children}
    </Link>
  );
}
