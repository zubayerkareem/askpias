import { createFileRoute, Link } from "@tanstack/react-router";
import { CaseStudyEditorForm } from "@/components/admin/CaseStudyEditorForm";
import { useCaseStudy } from "@/hooks/use-case-studies";

export const Route = createFileRoute("/admin/_authenticated/case-studies/$id")({
  component: CaseStudyEditRoute,
});

function CaseStudyEditRoute() {
  const { id } = Route.useParams();
  const { data: caseStudy, isPending, error } = useCaseStudy(id);

  if (isPending) {
    return <div className="skeleton-shimmer h-[500px] w-full rounded-xl" />;
  }

  if (error || !caseStudy) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Case study not found.</p>
        <Link
          to="/admin/case-studies"
          className="mt-3 inline-block text-sm font-semibold text-accent"
        >
          Back to case studies
        </Link>
      </div>
    );
  }

  return <CaseStudyEditorForm caseStudy={caseStudy} />;
}
