import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { dummyImage } from "@/lib/notes-data";
import { caseStudyBySlugQueryOptions } from "@/hooks/use-case-studies";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: async ({ context, params }) => {
    const caseStudy = await context.queryClient.ensureQueryData(
      caseStudyBySlugQueryOptions(params.slug),
    );
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <article className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
          <Link to="/case-studies" className="text-sm font-semibold text-accent">
            ← All case studies
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            {caseStudy.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{caseStudy.name}</h1>
          <p className="mt-4 text-muted-foreground">{caseStudy.summary}</p>

          <img
            src={caseStudy.image_url ?? dummyImage(caseStudy.slug)}
            alt=""
            className="mt-8 aspect-video w-full rounded-2xl border border-border object-cover"
          />

          {caseStudy.content && (
            // Safe: `content` is admin-authored HTML — write access is gated by
            // Supabase Auth + RLS, not arbitrary visitor input.
            <div
              className="prose dark:prose-invert mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: caseStudy.content }}
            />
          )}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
