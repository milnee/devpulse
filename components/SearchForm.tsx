"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { parseUsername } from "@/lib/validate";

const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "addyosmani", "yyx990803"];

interface Props {
  defaultValue?: string;
  compact?: boolean;
}

export function SearchForm({ defaultValue = "", compact = false }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const submit = useCallback(
    (input: string) => {
      const parsed = parseUsername(input);
      if ("error" in parsed) {
        setError(parsed.error);
        return;
      }
      setError(null);
      setLoading(true);
      router.push(`/u/${parsed.username}`);
    },
    [router]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(value);
  }

  return (
    <div className={compact ? "w-full max-w-lg" : "w-full max-w-xl"}>
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center rounded-xl overflow-hidden transition-all duration-150"
          style={{
            background: "#161b22",
            border: `1px solid ${focused ? "#484f58" : "#30363d"}`,
            boxShadow: "none",
          }}
        >
          <div className="flex items-center px-3 shrink-0">
            <Search size={14} style={{ color: "#484f58" }} />
          </div>

          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={compact ? "Search another username…" : "GitHub username or URL…"}
            className={`flex-1 bg-transparent outline-none min-w-0 ${
              compact ? "h-9 text-sm" : "h-12 text-base"
            }`}
            style={{ color: "#e6edf3" }}
            autoFocus={!compact}
            disabled={loading}
            aria-label="GitHub username"
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); submit(value); }
            }}
          />

          <button
            type="submit"
            disabled={loading || !value.trim()}
            className={`flex items-center gap-1.5 font-medium rounded-lg m-1.5 shrink-0 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed ${
              compact ? "px-3 h-7 text-xs" : "px-4 h-9 text-sm"
            }`}
            style={{
              background: "linear-gradient(135deg,#58a6ff,#a371f7)",
              color: "#fff",
            }}
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <>
                {compact ? "Go" : "Analyze"}
                {!compact && <ArrowRight size={13} />}
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-2 text-xs" style={{ color: "#f85149" }}>{error}</p>
      )}

      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs" style={{ color: "#484f58" }}>
          <span>Try:</span>
          {EXAMPLES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => { setValue(name); submit(name); }}
              className="px-2 py-0.5 rounded-md font-mono transition-all"
              style={{ background: "#161b22", border: "1px solid #30363d", color: "#8b949e" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#58a6ff";
                e.currentTarget.style.color = "#58a6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#30363d";
                e.currentTarget.style.color = "#8b949e";
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
