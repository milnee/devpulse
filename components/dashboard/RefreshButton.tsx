"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  username: string;
}

export function RefreshButton({ username }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    setLoading(true);
    try {
      // Hit the API with nocache=1 to bust the server-side cache
      await fetch(`/api/analyze?username=${encodeURIComponent(username)}&nocache=1`);
      // Then refresh the page so the server component re-renders with fresh data
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
      style={{
        background: "#1c2128",
        border: "1px solid #30363d",
        color: "#8b949e",
      }}
      title="Force refresh — bypasses 6-hour cache"
    >
      <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
      {loading ? "Refreshing…" : "Refresh"}
    </button>
  );
}
