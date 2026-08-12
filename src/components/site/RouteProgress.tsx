import { useRouterState } from "@tanstack/react-router";
import NProgress from "nprogress";
import { useEffect } from "react";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 120,
  minimum: 0.15,
  speed: 400,
});

/**
 * Thin top-of-page progress bar driven by the router's loading state.
 * Fires on every navigation (client-side only — effects never run during SSR),
 * independent of the pending-component threshold in router.tsx, so fast
 * transitions still get a quick visual acknowledgement even when they resolve
 * too quickly to show the PageSkeleton.
 */
export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  return null;
}
