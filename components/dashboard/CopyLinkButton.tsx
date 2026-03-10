"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const el = document.createElement("input");
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-medium transition-all"
      style={{
        background: copied ? "rgba(63,185,80,0.12)" : "#1c2128",
        border: `1px solid ${copied ? "rgba(63,185,80,0.3)" : "#30363d"}`,
        color: copied ? "#3fb950" : "#8b949e",
      }}
    >
      {copied ? (
        <>
          <Check size={13} />
          Copied!
        </>
      ) : (
        <>
          <Link2 size={13} />
          Share
        </>
      )}
    </button>
  );
}
