import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { format } from "date-fns";
import { ArrowRight, Lock, Zap } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CoverImage } from "@/components/site/CoverImage";
import { LeadMagnetForm } from "@/components/site/LeadMagnetForm";
import { noteBySlugQueryOptions, useNotes } from "@/hooks/use-notes";
import { enrichContentHtml } from "@/lib/video";
import { pickRelatedNotes } from "@/lib/related-notes";
import { analytics } from "@/lib/analytics";

export const Route = createFileRoute("/notes/$slug")({
  loader: async ({ context, params }) => {
    const note = await context.queryClient
      .ensureQueryData(noteBySlugQueryOptions(params.slug))
      .catch(() => null);
    if (!note) throw notFound();
    return note;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://askpias.com/notes/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} | Pias Ahmed` },
        { name: "description", content: loaderData.excerpt },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:url", content: url },
        ...(loaderData.image_url ? [{ property: "og:image", content: loaderData.image_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: NoteDetail,
});

function NoteDetail() {
  const note = Route.useLoaderData();
  const { data: allNotes } = useNotes();
  const related = pickRelatedNotes(note, allNotes ?? []);

  useEffect(() => {
    analytics.viewItem({ item_id: note.slug, item_name: note.title }, "blog");
  }, [note.slug, note.title]);

  return (
    <PageShell>
      <article className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="mx-auto max-w-[760px]">
          <Link to="/notes" className="text-sm font-semibold text-brand">
            ← All notes
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-muted-foreground">
            <span>{format(new Date(note.published_at), "d MMMM yyyy")}</span>
            {note.locked && (
              <>
                <span aria-hidden>/</span>
                <span className="inline-flex items-center gap-1">
                  <Lock className="size-3" aria-hidden />
                  Members only
                </span>
              </>
            )}
          </div>

          <h1 className="mt-4 flex items-start gap-2 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
            {note.featured && <Zap className="mt-2 size-5 shrink-0 fill-brand text-brand" />}
            {note.title}
          </h1>

          <CoverImage
            src={note.image_url}
            label={note.title}
            className="mt-7 aspect-video w-full rounded-xl object-cover"
          />

          {note.locked ? (
            <div className="mt-8 rounded-xl border border-dashed border-line p-8 text-center">
              <Lock className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-3 font-display font-bold">This note is for subscribers only</p>
              <p className="mt-1 text-sm text-muted-foreground">{note.excerpt}</p>
            </div>
          ) : note.content ? (
            // Safe: `content` is admin-authored HTML — write access is gated by the admin login.
            <div
              className="prose prose-neutral mt-8 max-w-none prose-headings:font-display prose-headings:font-extrabold prose-a:text-brand"
              dangerouslySetInnerHTML={{ __html: enrichContentHtml(note.content) }}
            />
          ) : (
            <p className="mt-8 text-muted-foreground">{note.excerpt}</p>
          )}

          {!note.locked && note.lead_magnet_file_url && (
            <LeadMagnetForm
              noteId={note.id}
              slug={note.slug}
              title={note.title}
              ctaLabel={note.lead_magnet_cta_label}
              fileUrl={note.lead_magnet_file_url}
              paymentRequired={note.lead_magnet_payment_required}
              price={note.lead_magnet_price}
            />
          )}

          {related.length > 0 && (
            <aside className="mt-12 border-t border-line pt-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-extrabold tracking-tight">
                  Related posts
                </h2>
                <Link to="/notes" className="text-sm font-semibold text-brand">
                  All notes
                </Link>
              </div>

              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to="/notes/$slug"
                      params={{ slug: item.slug }}
                      className="group flex items-center gap-4 rounded-xl border border-line bg-page p-3 transition-colors hover:border-brand/40"
                    >
                      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 font-display text-sm leading-snug font-bold decoration-brand/40 underline-offset-4 group-hover:underline">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {format(new Date(item.published_at), "d MMM yyyy")}
                        </p>
                      </div>

                      <ArrowRight
                        className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>

      <SiteFooter />
    </PageShell>
  );
}
