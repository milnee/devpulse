import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 text-center gap-6">
      <p
        className="text-7xl font-bold"
        style={{
          background: "linear-gradient(135deg,#58a6ff,#a371f7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </p>
      <div>
        <h2 className="text-xl font-semibold mb-1.5" style={{ color: "#e6edf3" }}>
          User not found
        </h2>
        <p className="text-sm" style={{ color: "#8b949e" }}>
          That GitHub profile doesn&apos;t exist or may have been renamed.
        </p>
      </div>
      <SearchForm compact />
      <Link
        href="/"
        className="text-sm transition-colors"
        style={{ color: "#484f58" }}
      >
        ← Back to home
      </Link>
    </div>
  );
}
