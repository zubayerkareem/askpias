import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useLeadMagnetSubmissions } from "@/hooks/use-lead-magnets";
import { usePagedList } from "@/hooks/use-paged-list";

export const Route = createFileRoute("/admin/_authenticated/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const { data: submissions, isPending } = useLeadMagnetSubmissions();
  const { pageItems, page, setPage, totalPages } = usePagedList(submissions, 10);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">Submissions from note lead magnets.</p>

      <div className="mt-6 rounded-xl border border-border">
        {isPending ? (
          <div className="skeleton-shimmer h-48 w-full rounded-xl" />
        ) : submissions && submissions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>
                    {s.notes?.title ? (
                      <Link
                        to="/admin/notes/$id"
                        params={{ id: s.note_id }}
                        className="text-accent hover:underline"
                      >
                        {s.notes.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {format(new Date(s.created_at), "d MMM yyyy, h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No leads yet.</p>
        )}
        {submissions && submissions.length > 0 && totalPages > 1 && (
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
