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
import { useLeadMagnetSubmissions } from "@/hooks/use-lead-magnets";

export const Route = createFileRoute("/admin/_authenticated/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const { data: submissions, isPending } = useLeadMagnetSubmissions();

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
              {submissions.map((s) => (
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
      </div>
    </div>
  );
}
