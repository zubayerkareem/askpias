import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { format } from "date-fns";
import { ArrowRight, Lock, Zap } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteAvatar } from "@/components/site/SiteAvatar";
import { CoverImage } from "@/components/site/CoverImage";
import { LeadMagnetForm } from "@/components/site/LeadMagnetForm";
import { noteBySlugQueryOptions, useNotes } from "@/hooks/use-notes";
import { enrichContentHtml } from "@/lib/video";
import { readingTime } from "@/lib/reading-time";
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
  const minutes = readingTime(note.content ?? note.excerpt);

  useEffect(() => {
    analytics.viewItem({ item_id: note.slug, item_name: note.title }, "blog");
  }, [note.slug, note.title]);

  return (
    <PageShell>
      <article className="px-6 pt-8 pb-12 sm:px-10 lg:px-16 lg:pt-12 lg:pb-16 xl:px-20">
        <div className="mx-auto max-w-[1040px]">
          <header className="mx-auto max-w-[820px]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/notes"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
              >
                ← All notes
              </Link>

              {note.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[0.68rem] font-bold text-brand">
                  <Zap className="size-3 fill-current" aria-hidden />
                  Featured
                </span>
              )}
            </div>

            <p className="mt-8 text-[0.68rem] font-bold tracking-[0.16em] uppercase text-brand">
              Notes
            </p>

            <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-extrabold tracking-[-0.035em] text-balance">
              {note.title}
            </h1>

            {note.excerpt && (
              <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-[1.15rem]">
                {note.excerpt}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <SiteAvatar
                  alt="Pias Ahmed"
                  width={24}
                  height={24}
                  className="size-6 shrink-0 rounded-full border border-line object-cover"
                />
                <span className="font-semibold text-foreground">Pias Ahmed</span>
              </span>
              <span aria-hidden className="size-1 rounded-full bg-line" />
              <time dateTime={note.published_at}>
                {format(new Date(note.published_at), "d MMMM yyyy")}
              </time>
              <span aria-hidden className="size-1 rounded-full bg-line" />
              <span>{minutes} min read</span>
              {note.locked && (
                <span className="inline-flex items-center gap-1 text-brand">
                  <Lock className="size-3.5" aria-hidden />
                  Members only
                </span>
              )}
            </div>
          </header>

          <CoverImage
            src={note.image_url}
            label={note.title}
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-line object-cover sm:mt-10"
          />

          <div className="mx-auto mt-9 max-w-[720px] sm:mt-12">
            {note.locked ? (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center sm:p-10">
                <Lock className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-3 font-display font-bold">This note is for subscribers only</p>
                <p className="mt-1 text-sm text-muted-foreground">{note.excerpt}</p>
              </div>
            ) : note.content ? (
              // Safe: `content` is admin-authored HTML — write access is gated by the admin login.
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: enrichContentHtml(note.content) }}
              />
            ) : (
              <p className="text-lg leading-relaxed text-muted-foreground">{note.excerpt}</p>
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
              <aside className="mt-14 border-t border-line pt-7">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-lg font-extrabold tracking-tight">
                    Keep reading
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
        </div>
      </article>

      <SiteFooter />
    </PageShell>
  );
}
