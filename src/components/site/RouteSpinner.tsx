export function RouteSpinner() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-5">
      <div className="flex flex-col items-center gap-4">
        <span className="relative inline-flex size-12">
          <span className="absolute inset-0 rounded-full border-2 border-border" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-accent" />
          <span className="absolute inset-2 rounded-full bg-primary/20 blur-md" />
        </span>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
