import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell } from "@/components/site/PageShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CoverImage } from "@/components/site/CoverImage";
import { caseStudyBySlugQueryOptions } from "@/hooks/use-case-studies";
import { enrichContentHtml } from "@/lib/video";
import { analytics } from "@/lib/analytics";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: async ({ context, params }) => {
    const caseStudy = await context.queryClient
      .ensureQueryData(caseStudyBySlugQueryOptions(params.slug))
      .catch(() => null);
    if (!caseStudy) throw notFound();
    return caseStudy;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://askpias.com/case-studies/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.name} | Pias Ahmed` },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: loaderData.name },
        { property: "og:description", content: loaderData.summary },
        { property: "og:url", content: url },
        ...(loaderData.image_url ? [{ property: "og:image", content: loaderData.image_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CaseStudyDetail,
});

function CaseStudyDetail() {
  const caseStudy = Route.useLoaderData();

  useEffect(() => {
    analytics.viewItem(
      {
        item_id: caseStudy.slug,
        item_name: caseStudy.name,
        item_category: caseStudy.tags[0] ?? "case study",
      },
      "case_studies",
    );
  }, [caseStudy.slug, caseStudy.name, caseStudy.tags]);

  return (
    <PageShell>
      <article className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="mx-auto max-w-[760px]">
          <Link to="/case-studies" className="text-sm font-semibold text-brand">
            ← All case studies
          </Link>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {caseStudy.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.7rem] font-bold text-brand"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
            {caseStudy.name}
          </h1>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted-foreground">
            {caseStudy.summary}
          </p>

          <CoverImage
            src={caseStudy.image_url}
            label={caseStudy.tags[0] ?? caseStudy.name}
            className="mt-7 aspect-video w-full rounded-xl object-cover"
          />

          {caseStudy.content && (
            // Safe: `content` is admin-authored HTML — write access is gated by the admin login.
            <div
              className="prose prose-neutral mt-8 max-w-none prose-headings:font-display prose-headings:font-extrabold prose-a:text-brand"
              dangerouslySetInnerHTML={{ __html: enrichContentHtml(caseStudy.content) }}
            />
          )}
        </div>
      </article>

      <SiteFooter />
    </PageShell>
  );
}
