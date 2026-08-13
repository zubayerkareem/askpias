import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Testimonials } from "@/components/site/Testimonials";
import { NoteRow, NoteRowSkeleton } from "@/components/site/NoteRow";
import { useNotes } from "@/hooks/use-notes";

const title = "Notes — Marketing & Growth | Pias Ahmed";
const description =
  "Practical notes on marketing strategy, performance ads, conversion funnels and brand positioning, written from real client work.";

export const Route = createFileRoute("/notes/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/notes" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/notes" }],
  }),
  component: Notes,
});

function Notes() {
  const { data: notes, isPending } = useNotes();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-16 text-center lg:py-20">
            <p className="eyebrow text-mint">Notes</p>
            <h1 className="mt-4 text-3xl sm:text-4xl">My notes on marketing and growth</h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Practical lessons pulled straight from real client work.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
            {isPending ? (
              Array.from({ length: 6 }).map((_, i) => <NoteRowSkeleton key={i} />)
            ) : notes && notes.length > 0 ? (
              notes.map((n) => <NoteRow key={n.slug} note={n} />)
            ) : (
              <p className="text-sm text-muted-foreground">No notes yet — check back soon.</p>
            )}
          </div>
        </section>

        <Testimonials title="Don't just take my word for it" />
      </main>
      <SiteFooter />
    </div>
  );
}
