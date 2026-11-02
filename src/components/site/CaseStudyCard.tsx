import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { CaseStudy } from "@/hooks/use-case-studies";
import { CoverImage } from "@/components/site/CoverImage";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      to="/case-studies/$slug"
      params={{ slug: caseStudy.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-page transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-32px_rgba(0,0,0,0.5)]"
    >
      <div className="relative overflow-hidden">
        <CoverImage
          src={caseStudy.image_url}
          label={caseStudy.tags[0] ?? caseStudy.name}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {caseStudy.tags[0] && (
          <span className="absolute top-3 left-3 rounded-full bg-brand px-2.5 py-1 text-[0.62rem] font-bold text-brand-foreground">
            {caseStudy.tags[0]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug font-bold">{caseStudy.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {caseStudy.summary}
        </p>

        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand">
          Read case study
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
