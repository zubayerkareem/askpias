import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { analytics } from "@/lib/analytics";

/**
 * Injects the Google Tag Manager container configured in the admin
 * (Site settings → Analytics), falling back to VITE_GTM_ID.
 */
export function TagManager() {
  const { data } = useSiteSettings();
  const envId = import.meta.env["VITE_GTM_ID"] as string | undefined;
  const containerId = (data?.gtm_container_id || envId)?.trim();

  useEffect(() => {
    if (!containerId) return;
    if (document.getElementById("gtm-script")) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
    document.head.appendChild(script);
  }, [containerId]);

  return null;
}

/** Pushes a GA4-style page_view on every client-side navigation. */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    analytics.pageView(pathname);
  }, [pathname]);

  return null;
}
