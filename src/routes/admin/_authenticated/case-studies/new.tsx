import { createFileRoute } from "@tanstack/react-router";
import { CaseStudyEditorForm } from "@/components/admin/CaseStudyEditorForm";

export const Route = createFileRoute("/admin/_authenticated/case-studies/new")({
  component: () => <CaseStudyEditorForm />,
});
