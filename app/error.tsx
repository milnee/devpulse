"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 text-center gap-6">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(248,81,73,0.08)",
          border: "1px solid rgba(248,81,73,0.2)",
        }}
      >
        <AlertTriangle size={24} style={{ color: "#f85149" }} />
      </div>

      {/* Text */}
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#e6edf3" }}>
          Something went wrong
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#8b949e" }}>
          An unexpected error occurred. This is usually temporary — try refreshing or going back home.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs font-mono" style={{ color: "#484f58" }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "linear-gradient(135deg,#58a6ff,#a371f7)",
            color: "#fff",
          }}
        >
          <RefreshCw size={14} />
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "#1c2128",
            border: "1px solid #30363d",
            color: "#8b949e",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
