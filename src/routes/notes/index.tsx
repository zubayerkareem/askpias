import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Testimonials } from "@/components/site/Testimonials";
import { NoteCard } from "@/components/site/NoteCard";
import { Reveal } from "@/components/site/Reveal";
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
  const { data } = useNotes();
  const notes = data ?? [];

  return (
    <PageShell>
      <PageHeader label="Blog" title="My notes on marketing and growth">
        Practical lessons pulled straight from real client work — what worked, what didn&apos;t, and
        why.
      </PageHeader>

      <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((n, i) => (
            <Reveal key={n.slug} delay={i * 60} className="h-full">
              <NoteCard note={n} />
            </Reveal>
          ))}
        </div>

        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground">No posts published yet.</p>
        )}
      </section>

      <Testimonials title="Don't just take my word for it" />
      <SiteFooter />
    </PageShell>
  );
}
