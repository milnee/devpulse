export default function Loading() {
  return (
    <div
      className="min-h-[calc(100vh-52px)] p-3 sm:p-4 lg:p-6"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="max-w-6xl mx-auto flex overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          minHeight: "calc(100vh - 52px - 3rem)",
        }}
      >
        {/* Sidebar skeleton */}
        <aside
          className="hidden lg:flex w-[200px] xl:w-[220px] shrink-0 flex-col"
          style={{ borderRight: "1px solid var(--border)" }}
        >
          <div className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--border-muted)" }}>
            <div className="skeleton h-3.5 w-20 rounded" />
          </div>
          <nav className="flex-1 p-2 pt-3 space-y-1">
            {[80, 60, 90, 70, 65].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <div className="skeleton w-3 h-3 rounded shrink-0" />
                <div className="skeleton h-3 rounded" style={{ width: `${w}%` }} />
              </div>
            ))}
          </nav>
          <div className="p-4" style={{ borderTop: "1px solid var(--border-muted)" }}>
            <div className="flex items-center gap-2.5">
              <div className="skeleton w-7 h-7 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-2.5 w-14 rounded" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main skeleton */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <div
            className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3"
            style={{ borderBottom: "1px solid var(--border-muted)" }}
          >
            <div className="skeleton h-4 w-28 rounded" />
            <div className="flex items-center gap-2">
              <div className="skeleton h-8 w-36 rounded-lg" />
              <div className="skeleton h-8 w-8 rounded-lg" />
              <div className="skeleton h-8 w-8 rounded-lg" />
            </div>
          </div>

          {/* Quick stat cards */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4"
            style={{ borderBottom: "1px solid var(--border-muted)" }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="px-4 sm:px-5 py-3.5"
                style={{ borderRight: i < 3 ? "1px solid var(--border-muted)" : "none" }}
              >
                <div className="skeleton h-2 w-14 rounded mb-2" />
                <div className="skeleton h-6 w-10 rounded mb-1.5" />
                <div className="skeleton h-2 w-20 rounded" />
              </div>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 p-4 sm:p-5 space-y-6">
            {/* Profile */}
            <div>
              <div className="skeleton h-2 w-14 rounded mb-3" />
              <div
                className="p-4 sm:p-6 rounded-xl"
                style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
              >
                <div className="flex gap-4">
                  <div className="skeleton w-16 h-16 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-5 w-36 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                    <div className="skeleton h-3 w-64 rounded" />
                  </div>
                </div>
                <div className="mt-4 pt-4 grid grid-cols-5 gap-2" style={{ borderTop: "1px solid var(--border-muted)" }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="skeleton h-5 w-8 rounded" />
                      <div className="skeleton h-2.5 w-12 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Heatmap */}
            <div>
              <div className="skeleton h-2 w-14 rounded mb-3" />
              <div
                className="p-4 rounded-xl"
                style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
              >
                <div className="skeleton h-28 w-full rounded" />
              </div>
            </div>

            {/* Charts */}
            <div className="skeleton h-40 w-full rounded-xl" />

            {/* Repos */}
            <div>
              <div className="skeleton h-2 w-20 rounded mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl space-y-3"
                    style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
                  >
                    {[90, 75, 60, 45].map((w, j) => (
                      <div key={j} className="skeleton h-3 rounded" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="skeleton h-2 w-18 rounded mb-3" />
              <div className="skeleton h-48 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
