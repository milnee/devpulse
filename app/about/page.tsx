import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About · DevPulse",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
        style={{ color: "#484f58" }}
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-5" style={{ color: "#e6edf3" }}>
        About DevPulse
      </h1>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "#8b949e" }}>
        <p>
          <strong style={{ color: "#e6edf3" }}>DevPulse</strong> is a free, public analytics
          dashboard for any GitHub account. No sign-up, no API keys, no tracking — just paste
          a username and explore.
        </p>

        {[
          {
            title: "What we show",
            content: (
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Profile summary: bio, followers, public repos</li>
                <li>Total stars &amp; forks across all repos</li>
                <li>Most starred and recently updated repositories</li>
                <li>Language breakdown chart (aggregated across top repos)</li>
                <li>90-day contribution heatmap with streak tracking</li>
                <li>90-day activity charts and weekday breakdown</li>
                <li>Side-by-side developer comparison</li>
                <li>Automated insights: active repo, primary language, trend</li>
              </ul>
            ),
          },
          {
            title: "Data & privacy",
            content: (
              <p className="mt-2">
                All data comes from the{" "}
                <a
                  href="https://docs.github.com/en/rest"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#34d399" }}
                >
                  public GitHub REST API
                </a>
                . We only display information GitHub already makes publicly visible.
                Results are cached for 6 hours to respect API rate limits.
              </p>
            ),
          },
          {
            title: "Rate limits",
            content: (
              <p className="mt-2">
                GitHub allows 60 unauthenticated API requests per hour per IP. DevPulse caches
                results aggressively so most lookups hit the cache. If you see a rate-limit
                error, please wait a few minutes.
              </p>
            ),
          },
        ].map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-base font-semibold" style={{ color: "#e6edf3" }}>
              {title}
            </h2>
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
