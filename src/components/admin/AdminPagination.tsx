import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** Minimal Previous/Next pager for admin list tables — client-side page state, no URL sync. */
export function AdminPagination({ page, totalPages, onPageChange }: AdminPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <ChevronLeft className="size-4" />
        Previous
      </button>
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
