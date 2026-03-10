import type { Metadata } from "next";
import { SearchForm } from "@/components/SearchForm";
import { BarChart2, Globe2, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "DevPulse — GitHub Developer Analytics",
};

const FEATURES = [
  {
    icon: BarChart2,
    accent: "#58a6ff",
    bg: "rgba(88,166,255,0.1)",
    title: "Deep analytics",
    desc: "Stars, forks, language breakdown, activity heatmaps.",
  },
  {
    icon: Globe2,
    accent: "#a371f7",
    bg: "rgba(163,113,247,0.1)",
    title: "Shareable profiles",
    desc: "Every result page has a permanent, shareable URL.",
  },
  {
    icon: Zap,
    accent: "#ffa657",
    bg: "rgba(255,166,87,0.1)",
    title: "Fast & cached",
    desc: "Results cached for 6 hours. No account needed.",
  },
];

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 py-20 overflow-hidden dot-grid"
    >
      {/* Background glow orbs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(88,166,255,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 80%, rgba(163,113,247,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Hero */}
      <div className="relative flex flex-col items-center text-center mb-10 max-w-2xl z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-6"
          style={{
            background: "rgba(88,166,255,0.1)",
            border: "1px solid rgba(88,166,255,0.25)",
            color: "#58a6ff",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] animate-pulse" />
          Public GitHub API · No sign-up required
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-5 leading-[1.1]"
          style={{ color: "#e6edf3" }}
        >
          GitHub Developer
          <br />
          <span
            style={{
              background: "linear-gradient(135deg,#58a6ff 0%,#a371f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Analytics
          </span>
        </h1>

        <p className="text-lg leading-relaxed max-w-md" style={{ color: "#8b949e" }}>
          Paste any GitHub username and instantly get a beautiful dashboard of their
          public repositories, languages, and activity.
        </p>
      </div>

      {/* Search */}
      <div className="relative z-10 w-full flex justify-center">
        <SearchForm />
      </div>

      {/* Feature cards */}
      <div className="relative z-10 mt-16 grid sm:grid-cols-3 gap-4 w-full max-w-xl">
        {FEATURES.map(({ icon: Icon, accent, bg, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center gap-2.5 p-5 rounded-xl transition-colors"
            style={{
              background: "#161b22",
              border: "1px solid #21262d",
            }}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg"
              style={{ background: bg }}
            >
              <Icon size={18} style={{ color: accent }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#e6edf3" }}>{title}</p>
            <p className="text-xs leading-relaxed" style={{ color: "#8b949e" }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
