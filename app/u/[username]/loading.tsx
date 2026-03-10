function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ""}`}
      style={{ background: "#1c2128", ...style }}
    />
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-5 ${className ?? ""}`}
      style={{ background: "#161b22", border: "1px solid #30363d" }}
    >
      {children}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <Shimmer className="h-9 w-full max-w-lg" />
        <Shimmer className="h-9 w-20" />
      </div>

      {/* Profile card */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#161b22", border: "1px solid #30363d" }}
      >
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <Shimmer className="w-[88px] h-[88px] rounded-full shrink-0" style={{ borderRadius: "50%" }} />
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap gap-2">
              <Shimmer className="h-6 w-32" />
              <Shimmer className="h-5 w-20" />
              <Shimmer className="h-5 w-24 rounded-full" />
            </div>
            <Shimmer className="h-4 w-full max-w-sm" />
            <Shimmer className="h-4 w-40" />
          </div>
        </div>
        <div
          className="mt-5 pt-5 grid grid-cols-2 sm:grid-cols-5 gap-4"
          style={{ borderTop: "1px solid #21262d" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Shimmer className="w-3 h-3" />
              <Shimmer className="h-6 w-10" />
              <Shimmer className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">
          {/* Activity chart */}
          <Card>
            <Shimmer className="h-3 w-36 mb-4" />
            <div className="flex gap-6 mb-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Shimmer className="h-6 w-8" />
                  <Shimmer className="h-3 w-14" />
                </div>
              ))}
            </div>
            <Shimmer className="w-full h-40" />
          </Card>

          {/* Weekday chart */}
          <Card>
            <Shimmer className="h-3 w-40 mb-4" />
            <Shimmer className="w-full h-36" />
          </Card>

          {/* Repo lists */}
          <div className="grid sm:grid-cols-2 gap-5">
            {Array.from({ length: 2 }).map((_, col) => (
              <Card key={col}>
                <Shimmer className="h-3 w-24 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <Shimmer className="h-4 w-28" />
                        <Shimmer className="h-3 w-full max-w-[160px]" />
                        <Shimmer className="h-4 w-16 rounded-full" />
                      </div>
                      <Shimmer className="h-4 w-12 shrink-0" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Insights */}
          <Card>
            <Shimmer className="h-3 w-16 mb-4" />
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Shimmer key={i} className="h-11 w-full rounded-lg" />
              ))}
            </div>
          </Card>

          {/* Language chart */}
          <Card>
            <Shimmer className="h-3 w-20 mb-4" />
            <Shimmer className="w-[180px] h-[180px] rounded-full mx-auto" style={{ borderRadius: "50%" }} />
            <div className="mt-4 space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Shimmer className="w-2 h-2 rounded-full shrink-0" style={{ borderRadius: "50%" }} />
                  <Shimmer className="h-3 w-16" />
                  <Shimmer className="flex-1 h-1.5 rounded-full" />
                  <Shimmer className="h-3 w-8" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
