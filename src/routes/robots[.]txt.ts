import { createFileRoute } from "@tanstack/react-router";
import { API_URL } from "@/lib/api";

type Settings = {
  seo_site_url: string | null;
  robots_txt: string | null;
};

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        let settings: Settings | null = null;

        try {
          const response = await fetch(`${API_URL}/settings`, {
            headers: { Accept: "application/json" },
          });
          if (response.ok) settings = (await response.json()) as Settings;
        } catch {
          settings = null;
        }

        const base = (settings?.seo_site_url || "https://askpias.com").replace(/\/$/, "");
        const sitemapLine = `Sitemap: ${base}/sitemap.xml`;

        const body =
          settings?.robots_txt?.trim() ||
          ["User-agent: *", "Allow: /", "", sitemapLine].join("\n");

        const content = body.includes("Sitemap:") ? body : `${body}\n\n${sitemapLine}`;

        return new Response(`${content}\n`, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
