import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CaseStudyCard } from "@/components/site/CaseStudyCard";
import { Reveal } from "@/components/site/Reveal";
import { useCaseStudies } from "@/hooks/use-case-studies";

const PREVIEW_COUNT = 3;

export function CaseStudiesSection() {
  const { data } = useCaseStudies();
  const cases = data ?? [];
  const preview = cases.slice(0, PREVIEW_COUNT);

  return (
    <section className="canvas-grid border-t border-border">
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="label">Clients</p>
              <h2 className="h-section mt-3 max-w-[18ch]">
                Results I can <span className="text-accent-text">show you</span>
              </h2>
            </div>
            <Link
              to="/case-studies"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:border-brand/60 hover:bg-foreground/5"
            >
              All case studies
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((c, i) => (
            <Reveal key={c.slug} delay={i * 90}>
              <CaseStudyCard caseStudy={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
