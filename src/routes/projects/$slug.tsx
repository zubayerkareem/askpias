import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { projectBySlugQueryOptions } from "@/hooks/use-projects";
import { projectIcon } from "@/lib/project-icons";
import { enrichContentHtml } from "@/lib/video";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient
      .ensureQueryData(projectBySlugQueryOptions(params.slug))
      .catch(() => null);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://askpias.com/projects/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.name} | Pias Ahmed` },
        { name: "description", content: loaderData.summary ?? loaderData.name },
        { property: "og:title", content: loaderData.name },
        { property: "og:description", content: loaderData.summary ?? loaderData.name },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const project = Route.useLoaderData();
  const Icon = projectIcon(project.icon);

  return (
    <PageShell>
      <article className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <Link to="/" className="text-sm font-semibold text-brand">
          ← Back to home
        </Link>

        <div className="mt-6 flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="size-6" aria-hidden />
          </span>
          <div>
            {project.kicker && (
              <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-brand">
                {project.kicker}
              </p>
            )}
            <h1 className="mt-1 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
              {project.name}
            </h1>
          </div>
        </div>

        {project.summary && (
          <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        )}

        {project.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.7rem] font-bold text-brand"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            {project.cta_label || "Visit project"}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        )}

        {project.description && (
          <div
            className="prose prose-neutral mt-10 max-w-[760px] prose-headings:font-display prose-headings:font-extrabold prose-a:text-brand"
            // Safe: `description` is admin-authored HTML from the rich editor.
            dangerouslySetInnerHTML={{ __html: enrichContentHtml(project.description) }}
          />
        )}
      </article>

      <SiteFooter />
    </PageShell>
  );
}
