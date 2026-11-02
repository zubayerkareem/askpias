import { createFileRoute } from "@tanstack/react-router";
import { API_URL } from "@/lib/api";

type Settings = {
  seo_site_url: string | null;
  sitemap_enabled: boolean;
};

type Item = { slug: string; updated_at?: string | null };
type Collection = { data: Item[] };

const STATIC_ROUTES: Array<{ path: string; changeFreq: string; priority: string }> = [
  { path: "/", changeFreq: "weekly", priority: "1.0" },
  { path: "/about", changeFreq: "monthly", priority: "0.7" },
  { path: "/books", changeFreq: "weekly", priority: "0.8" },
  { path: "/case-studies", changeFreq: "weekly", priority: "0.9" },
  { path: "/notes", changeFreq: "weekly", priority: "0.9" },
  { path: "/contact", changeFreq: "monthly", priority: "0.6" },
  { path: "/faqs", changeFreq: "monthly", priority: "0.5" },
  { path: "/booking", changeFreq: "monthly", priority: "0.8" },
];

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function urlEntry(loc: string, changeFreq: string, priority: string, lastmod?: string | null): string {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : null,
    `    <changefreq>${changeFreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const settings = await getJson<Settings>("/settings");

        if (settings && settings.sitemap_enabled === false) {
          return new Response("Not found", { status: 404 });
        }

        const base = (settings?.seo_site_url || "https://askpias.com").replace(/\/$/, "");

        const [notes, caseStudies, books, projects] = await Promise.all([
          getJson<Collection>("/notes"),
          getJson<Collection>("/case-studies"),
          getJson<Collection>("/books"),
          getJson<Collection>("/projects"),
        ]);

        const entries: string[] = STATIC_ROUTES.map((route) =>
          urlEntry(base + route.path, route.changeFreq, route.priority),
        );

        for (const note of notes?.data ?? []) {
          entries.push(urlEntry(`${base}/notes/${note.slug}`, "monthly", "0.7", note.updated_at));
        }

        for (const item of caseStudies?.data ?? []) {
          entries.push(urlEntry(`${base}/case-studies/${item.slug}`, "monthly", "0.7", item.updated_at));
        }

        for (const book of books?.data ?? []) {
          entries.push(urlEntry(`${base}/books/${book.slug}`, "monthly", "0.6"));
        }

        for (const project of projects?.data ?? []) {
          entries.push(urlEntry(`${base}/projects/${project.slug}`, "monthly", "0.6", project.updated_at));
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
