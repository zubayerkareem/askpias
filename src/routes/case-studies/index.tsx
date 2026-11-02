import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Testimonials } from "@/components/site/Testimonials";
import { CaseStudyCard } from "@/components/site/CaseStudyCard";
import { Reveal } from "@/components/site/Reveal";
import { useCaseStudies } from "@/hooks/use-case-studies";
import { useSiteSettings } from "@/hooks/use-site-settings";

const title = "Case Studies — Pias Ahmed | Marketing Consultant";
const description =
  "Case studies from marketing work with local and international brands — the problem, the system I built, the results and client reviews.";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/case-studies" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/case-studies" }],
  }),
  component: CaseStudies,
});

function CaseStudies() {
  const { data } = useCaseStudies();
  const { data: settings } = useSiteSettings();
  const cases = data ?? [];

  return (
    <PageShell>
      <PageHeader label="Projects" title="I let the results do the talking">
        A few brand stories — what the problem was, the system I built, and the results that
        followed.
      </PageHeader>

      {settings?.case_studies_iframe_url && (
        <section className="border-b border-line px-6 py-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="mx-auto max-w-[640px] overflow-hidden rounded-xl border border-line">
            <iframe
              src={settings.case_studies_iframe_url}
              className="aspect-video w-full"
              style={{ border: "none" }}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Pias Ahmed — featured video"
            />
          </div>
        </section>
      )}

      <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <CaseStudyCard caseStudy={c} />
            </Reveal>
          ))}
        </div>

        {cases.length === 0 && (
          <p className="text-sm text-muted-foreground">No case studies published yet.</p>
        )}
      </section>

      <Testimonials />

      <section className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">
              Your brand could be next.
            </h2>
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
              Start with a free 30-minute call. We look at your numbers and agree on the shortest
              path to growth.
            </p>
          </div>
          <a
            href="/booking"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Book a strategy call
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
