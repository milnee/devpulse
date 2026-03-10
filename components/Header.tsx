import Link from "next/link";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md"
      style={{
        borderBottom: "1px solid #21262d",
        backgroundColor: "rgba(13,17,23,0.85)",
      }}
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold transition-colors shrink-0"
          style={{ color: "#e6edf3" }}
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
            style={{ background: "linear-gradient(135deg,#58a6ff,#a371f7)" }}
          >
            <Github size={15} className="text-white" />
          </div>
          DevPulse
        </Link>

        <nav className="flex items-center gap-4 sm:gap-5 text-sm" style={{ color: "#8b949e" }}>
          <Link href="/about" className="transition-colors hover:text-white" style={{ color: "inherit" }}>
            About
          </Link>
          <a
            href="https://github.com/milnee/devpulse"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
            style={{ color: "inherit" }}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
