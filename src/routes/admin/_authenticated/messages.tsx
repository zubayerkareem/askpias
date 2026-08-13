import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useMarkMessageRead, useMessages } from "@/hooks/use-messages";

export const Route = createFileRoute("/admin/_authenticated/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { data: messages, isPending } = useMessages();
  const markRead = useMarkMessageRead();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Submissions from the "Ask me anything" form.
      </p>

      <div className="mt-6 rounded-xl border border-border">
        {isPending ? (
          <div className="skeleton-shimmer h-48 w-full rounded-xl" />
        ) : messages && messages.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Read</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="max-w-xs">{m.question}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(m.created_at), "d MMM yyyy, h:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={m.is_read}
                      onCheckedChange={(checked) => markRead.mutate({ id: m.id, isRead: checked })}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
