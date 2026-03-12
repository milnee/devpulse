"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeftRight, Loader2 } from "lucide-react";
import { parseUsername } from "@/lib/validate";

interface Props {
  defaultA?: string;
  defaultB?: string;
}

export function CompareForm({ defaultA = "", defaultB = "" }: Props) {
  const router = useRouter();
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(() => {
    const parsedA = parseUsername(a);
    const parsedB = parseUsername(b);
    let valid = true;
    if ("error" in parsedA) { setErrorA(parsedA.error); valid = false; } else setErrorA(null);
    if ("error" in parsedB) { setErrorB(parsedB.error); valid = false; } else setErrorB(null);
    if (!valid) return;
    setLoading(true);
    const uA = "username" in parsedA ? parsedA.username : "";
    const uB = "username" in parsedB ? parsedB.username : "";
    router.push(`/compare?a=${encodeURIComponent(uA)}&b=${encodeURIComponent(uB)}`);
  }, [a, b, router]);

  return (
    <div
      className="rounded-xl p-4 sm:p-5 mb-6"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
        {/* User A */}
        <div className="flex-1">
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ background: "var(--bg-elevated)", border: `1px solid ${errorA ? "var(--red)" : "var(--border)"}` }}
          >
            <div className="flex items-center px-3">
              <Search size={13} style={{ color: "var(--text-dim)" }} />
            </div>
            <input
              value={a}
              onChange={(e) => { setA(e.target.value); if (errorA) setErrorA(null); }}
              placeholder="First username…"
              className="flex-1 h-10 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
          {errorA && <p className="mt-1 text-xs" style={{ color: "var(--red)" }}>{errorA}</p>}
        </div>

        {/* VS divider */}
        <div className="flex items-center justify-center shrink-0 h-10">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
            style={{ background: "rgba(52,211,153,0.1)", color: "var(--accent)", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            VS
          </div>
        </div>

        {/* User B */}
        <div className="flex-1">
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ background: "var(--bg-elevated)", border: `1px solid ${errorB ? "var(--red)" : "var(--border)"}` }}
          >
            <div className="flex items-center px-3">
              <Search size={13} style={{ color: "var(--text-dim)" }} />
            </div>
            <input
              value={b}
              onChange={(e) => { setB(e.target.value); if (errorB) setErrorB(null); }}
              placeholder="Second username…"
              className="flex-1 h-10 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
          {errorB && <p className="mt-1 text-xs" style={{ color: "var(--red)" }}>{errorB}</p>}
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading || !a.trim() || !b.trim()}
          className="flex items-center justify-center gap-2 px-5 h-10 rounded-xl text-sm font-medium transition-opacity disabled:opacity-40 shrink-0"
          style={{ background: "linear-gradient(135deg,#34d399,#c084fc)", color: "#fff" }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <><ArrowLeftRight size={14} /> Compare</>}
        </button>
      </div>
    </div>
  );
}
