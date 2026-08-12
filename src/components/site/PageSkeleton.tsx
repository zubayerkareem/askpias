function Bar({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

/** Smooth skeleton placeholder shown while a route loads. */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Bar className="size-9 rounded-full" />
            <Bar className="h-5 w-28" />
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Bar key={i} className="h-4 w-16" />
            ))}
          </div>
          <Bar className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      <div className="page-enter mx-auto max-w-6xl px-5 py-12">
        <Bar className="h-4 w-32" />
        <Bar className="mt-5 h-10 w-full max-w-2xl" />
        <Bar className="mt-3 h-10 w-full max-w-md" />
        <Bar className="mt-6 h-4 w-full max-w-xl" />
        <Bar className="mt-2.5 h-4 w-full max-w-lg" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border panel-card p-6"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Bar className="size-11 rounded-xl" />
              <Bar className="mt-6 h-5 w-3/4" />
              <Bar className="mt-3 h-4 w-full" />
              <Bar className="mt-2 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
