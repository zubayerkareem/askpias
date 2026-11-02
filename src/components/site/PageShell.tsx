import type { ReactNode } from "react";
import { SiteNav } from "@/components/site/SiteNav";

/**
 * Page frame: cream canvas edge to edge, content capped at 1280px, floating nav.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter pt-20 sm:pt-24">
        <div className="mx-auto w-full max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
