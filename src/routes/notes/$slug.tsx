import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Lock, MessageCircle, Zap } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LeadMagnetForm } from "@/components/site/LeadMagnetForm";
import { dummyImage } from "@/lib/notes-data";
import { noteBySlugQueryOptions } from "@/hooks/use-notes";

export const Route = createFileRoute("/notes/$slug")({
  loader: async ({ context, params }) => {
    const note = await context.queryClient.ensureQueryData(noteBySlugQueryOptions(params.slug));
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <article className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
          <Link to="/notes" className="text-sm font-semibold text-accent">
            ← All notes
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>{format(new Date(note.published_at), "d MMMM yyyy")}</span>
            <span aria-hidden>/</span>
            <span>Pias Ahmed</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground">
              {note.category}
            </span>
            {note.locked ? (
              <Lock className="size-3.5" aria-label="Members only" />
            ) : (
              <span className="flex items-center gap-1">
                <MessageCircle className="size-3.5" />
                {note.comment_count}
              </span>
            )}
          </div>

          <h1 className="mt-4 flex items-start gap-2 text-3xl leading-tight sm:text-4xl">
            {note.featured && <Zap className="mt-2 size-6 shrink-0 fill-mint text-mint" />}
            {note.title}
          </h1>

          <img
            src={note.image_url ?? dummyImage(note.slug)}
            alt=""
            className="mt-8 aspect-video w-full rounded-2xl border border-border object-cover"
          />

          {note.locked ? (
            <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
              <Lock className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-3 font-medium">This note is for subscribers only</p>
              <p className="mt-1 text-sm text-muted-foreground">{note.excerpt}</p>
            </div>
          ) : note.content ? (
            // Safe: `content` is admin-authored HTML — write access is gated by
            // Supabase Auth + RLS, not arbitrary visitor input.
            <div
              className="prose dark:prose-invert mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          ) : (
            <p className="mt-8 text-muted-foreground">{note.excerpt}</p>
          )}

          {!note.locked && note.lead_magnet_file_url && (
            <LeadMagnetForm
              noteId={note.id}
              ctaLabel={note.lead_magnet_cta_label}
              fileUrl={note.lead_magnet_file_url}
            />
          )}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
