import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminRedirect,
});

const ADMIN_URL: string =
  (import.meta.env["VITE_ADMIN_URL"] as string | undefined) ?? "http://127.0.0.1:8000/admin";

function AdminRedirect() {
  useEffect(() => {
    window.location.replace(ADMIN_URL);
  }, []);

  return (
    <div className="canvas-grid flex min-h-screen items-center justify-center px-6">
      <div className="sheet px-8 py-10 text-center">
        <h1 className="font-display text-2xl font-extrabold">Opening the admin panel…</h1>
        <p className="mt-2 text-sm text-sheet-muted">
          Content is managed in the Laravel dashboard.
        </p>
        <a
          href={ADMIN_URL}
          className="mt-6 inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground"
        >
          Open admin
        </a>
      </div>
    </div>
  );
}
