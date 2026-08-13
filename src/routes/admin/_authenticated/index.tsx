import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authenticated/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/notes" });
  },
});
