import type { Metadata } from "next";
import Link from "next/link";
import {
  GitCommitHorizontal, BarChart2, ArrowLeftRight,
  Flame, Code2, Activity, ChevronRight, Github,
} from "lucide-react";
import { SearchForm } from "@/components/SearchForm";

export const metadata: Metadata = {
  title: "DevPulse — GitHub Developer Analytics",
  description:
    "Instant public GitHub analytics. Paste any username and get a beautiful dashboard of repos, languages, and activity — no sign-up needed.",
};

const FEATURES = [
  {
    icon: BarChart2,
    color: "#58a6ff",
    glow: "rgba(88,166,255,0.08)",
    title: "Deep activity insights",
    desc: "90-day contribution heatmap, push events, PR velocity, code reviews, and streak tracking — all in one view.",
  },
  {
    icon: Code2,
    color: "#a371f7",
    glow: "rgba(163,113,247,0.08)",
    title: "Language breakdown",
    desc: "Visualize byte-weighted language distribution across repos with an interactive donut chart and ranked bars.",
  },
  {
    icon: ArrowLeftRight,
    color: "#ffa657",
    glow: "rgba(255,166,87,0.08)",
    title: "Side-by-side compare",
    desc: "Compare any two GitHub developers head-to-head — stars, followers, commits, streaks, activity trends.",
  },
  {
    icon: Flame,
    color: "#3fb950",
    glow: "rgba(63,185,80,0.08)",
    title: "Shareable & cached",
    desc: "Every profile gets a permanent URL. Results are cached for 6 hours so repeated lookups are instant.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Enter a username",
    desc: "Paste any GitHub username or profile URL into the search bar.",
  },
  {
    num: "02",
    title: "We crunch the data",
    desc: "DevPulse fetches public repos, events, and languages — all from the GitHub API with no login required.",
  },
  {
    num: "03",
    title: "Explore the dashboard",
    desc: "Get a beautiful, shareable analytics page with charts, metrics, and coding insights.",
  },
];

const TRUST_ITEMS = [
  "Free forever",
  "No account required",
  "Public GitHub API only",
  "90-day event history",
  "Timezone-aware streaks",
  "Light & dark mode",
];

export default function HomePage() {
  return (
    <div className="flex flex-col" style={{ color: "var(--text)" }}>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center min-h-[100vh] px-5 pt-24 pb-32 overflow-hidden"
      >
        {/* Grid background */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" />

        {/* Ambient glow — top */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "900px",
            height: "500px",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(88,166,255,0.13) 0%, transparent 65%)",
          }}
        />
        {/* Ambient glow — bottom right */}
        <div
          className="pointer-events-none absolute bottom-0 right-0"
          style={{
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(163,113,247,0.07) 0%, transparent 60%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">

          {/* Announcement badge */}
          <div
            className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-8 cursor-default select-none"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                background: "#3fb950",
                boxShadow: "0 0 6px #3fb950",
                animation: "pulse-ring 2s ease-in-out infinite",
              }}
            />
            Free · Public API · No sign-up
            <span
              className="ml-0.5 pl-2 flex items-center gap-0.5"
              style={{ borderLeft: "1px solid var(--border)", color: "var(--accent)" }}
            >
              Compare devs <ChevronRight size={11} />
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up delay-100 font-bold leading-[1.08] mb-6 tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
          >
            GitHub analytics
            <br />
            <span className="gradient-text-blue">for every developer.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="animate-fade-up delay-200 text-lg leading-relaxed max-w-xl mb-10"
            style={{ color: "var(--text-muted)", fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
          >
            Paste any GitHub username and instantly get a beautiful dashboard
            of their repositories, languages, activity, and coding patterns.
          </p>

          {/* Search */}
          <div className="animate-fade-up delay-300 w-full max-w-xl mb-8">
            <SearchForm />
          </div>

          {/* Trust bar */}
          <div className="animate-fade-up delay-400 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs" style={{ color: "var(--text-dim)" }}>
            {TRUST_ITEMS.map((item, i) => (
              <span key={item} className="flex items-center gap-1.5">
                {i > 0 && <span className="w-0.5 h-0.5 rounded-full" style={{ background: "var(--text-dim)" }} />}
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-fade-in delay-600 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "var(--text-dim)" }}
        >
          <Activity size={13} />
          <div className="h-8 w-px" style={{ background: "linear-gradient(to bottom, var(--text-dim), transparent)" }} />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-24" style={{ borderTop: "1px solid var(--border-muted)" }}>
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "var(--text-dim)" }}>
              Features
            </p>
            <h2
              className="font-bold tracking-tight max-w-lg"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.025em" }}
            >
              Everything you need to understand a developer
            </h2>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "var(--border-muted)" }}>
            {FEATURES.map(({ icon: Icon, color, glow, title, desc }) => (
              <div
                key={title}
                className="feature-card flex flex-col gap-4 p-7"
                style={{ background: "var(--bg-card)", border: "1px solid transparent" }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: glow, border: `1px solid ${color}22` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section
        className="px-5 sm:px-8 py-24"
        style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-muted)", borderBottom: "1px solid var(--border-muted)" }}
      >
        <div className="max-w-6xl mx-auto">

          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "var(--text-dim)" }}>
              How it works
            </p>
            <h2
              className="font-bold tracking-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.025em" }}
            >
              Simple by design
            </h2>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 gap-0 relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden sm:block absolute top-8 left-[16.6%] right-[16.6%] h-px"
              style={{ background: "var(--border)" }}
            />

            {STEPS.map(({ num, title, desc }, i) => (
              <div key={num} className="relative flex flex-col gap-5 px-0 sm:px-8 py-6 sm:py-0">
                {/* Number */}
                <div className="flex items-center gap-4">
                  <div
                    className="step-number relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl text-2xl font-bold shrink-0"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-dim)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {num}
                  </div>
                  {/* Mobile connector */}
                  {i < STEPS.length - 1 && (
                    <div className="sm:hidden flex-1 h-px" style={{ background: "var(--border)" }} />
                  )}
                </div>

                <div className="space-y-2">
                  <h3
                    className="text-base font-semibold"
                    style={{ color: "var(--text)", letterSpacing: "-0.015em" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW STRIP ─────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-20" style={{ borderBottom: "1px solid var(--border-muted)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">

            {/* Left: text */}
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "var(--text-dim)" }}>
                Try it now
              </p>
              <h2
                className="font-bold tracking-tight mb-4"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", letterSpacing: "-0.025em" }}
              >
                Analyze any public GitHub profile — instantly.
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                No API key needed. No rate limits for occasional use.
                Just type a username and hit Analyze.
              </p>
              <div className="flex flex-wrap gap-3">
                {["torvalds", "gaearon", "sindresorhus"].map((name) => (
                  <Link
                    key={name}
                    href={`/u/${name}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Github size={11} />
                    {name}
                    <ChevronRight size={10} style={{ color: "var(--text-dim)" }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: mini stats card mock */}
            <div
              className="w-full sm:w-auto sm:min-w-[320px] rounded-2xl p-5 shrink-0"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "0 0 0 1px var(--border-muted), 0 24px 48px -12px rgba(0,0,0,0.35)",
              }}
            >
              {/* Mock header */}
              <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid var(--border-muted)" }}>
                <div className="w-10 h-10 rounded-full" style={{ background: "linear-gradient(135deg,#58a6ff,#a371f7)" }} />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 rounded-sm skeleton" />
                  <div className="h-2.5 w-20 rounded-sm skeleton" />
                </div>
              </div>
              {/* Mock stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[["2.4k", "Stars"], ["847", "Followers"], ["94", "Repos"]].map(([val, label]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-base font-bold" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>{val}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>{label}</span>
                  </div>
                ))}
              </div>
              {/* Mock heatmap strip */}
              <div className="flex gap-0.5 flex-wrap">
                {Array.from({ length: 56 }, (_, i) => {
                  const intensity = [0, 0, 1, 0, 2, 1, 0, 3, 1, 0, 0, 2, 1, 0][i % 14];
                  const colors = ["#1a1e27", "#0c3f6e", "#1a5ba8", "#3580c3"];
                  return (
                    <div
                      key={i}
                      style={{ width: 9, height: 9, borderRadius: 2, background: colors[intensity], flexShrink: 0 }}
                    />
                  );
                })}
              </div>
              <p className="text-[10px] mt-3" style={{ color: "var(--text-dim)" }}>
                Activity preview · 90 days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARE CTA ───────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div
            className="relative rounded-2xl p-10 sm:p-14 overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {/* Glow */}
            <div
              className="pointer-events-none absolute top-0 right-0 w-96 h-96 opacity-40"
              style={{
                background: "radial-gradient(ellipse at 80% 0%, rgba(163,113,247,0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div className="max-w-lg">
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4"
                  style={{
                    background: "rgba(163,113,247,0.1)",
                    border: "1px solid rgba(163,113,247,0.2)",
                    color: "#a371f7",
                  }}
                >
                  <ArrowLeftRight size={11} />
                  New feature
                </div>
                <h2
                  className="font-bold tracking-tight mb-3"
                  style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", letterSpacing: "-0.025em" }}
                >
                  Compare two developers<br />side-by-side.
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Stars, followers, commits, streaks, languages, activity trends — all in one head-to-head view.
                </p>
              </div>

              <Link
                href="/compare"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shrink-0 transition-opacity hover:opacity-80"
                style={{
                  background: "linear-gradient(135deg, #58a6ff, #a371f7)",
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                <ArrowLeftRight size={14} />
                Try Compare
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer
        className="px-5 sm:px-8 py-8"
        style={{ borderTop: "1px solid var(--border-muted)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <defs>
                <linearGradient id="footer-grad" x1="0" y1="0" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#58a6ff"/>
                  <stop offset="100%" stopColor="#a371f7"/>
                </linearGradient>
              </defs>
              <path d="M9 1L17 9L9 17L1 9L9 1Z" fill="url(#footer-grad)"/>
              <path d="M9 5L13 9L9 13L5 9L9 5Z" fill="var(--bg)" opacity="0.6"/>
            </svg>
            <span className="text-xs font-medium">DevPulse</span>
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>© 2025</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs" style={{ color: "var(--text-dim)" }}>
            <Link href="/compare" className="transition-colors hover:text-[var(--text)]" style={{ color: "inherit" }}>Compare</Link>
            <Link href="/about" className="transition-colors hover:text-[var(--text)]" style={{ color: "inherit" }}>About</Link>
            <a
              href="https://github.com/milnee/devpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-[var(--text)]"
              style={{ color: "inherit" }}
            >
              <Github size={12} />
              Open source
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
