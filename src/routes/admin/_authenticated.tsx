import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/_authenticated")({
  component: AuthenticatedAdminLayout,
});

/**
 * Session lives only in the browser (Supabase Auth via localStorage), so this
 * can't be a `beforeLoad` guard the way SSR-aware auth normally would be —
 * there's no `window` during the server render. Instead this component
 * renders one of three states and only ever mounts <Outlet/> (and therefore
 * any child route's data-fetching) once a session is confirmed present:
 *   loading    -> skeleton, no admin UI or data fetched
 *   anonymous  -> inline login form in place of the page (no redirect/URL
 *                 change, so a login mid-deep-link lands back where you were)
 *   authenticated -> real admin shell + the requested child route
 * The actual access boundary is Postgres RLS (see supabase/migrations), not
 * this guard — it only exists to hide the UI from logged-out visitors.
 */
function AuthenticatedAdminLayout() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="skeleton-shimmer h-10 w-48 rounded-lg" />
      </div>
    );
  }

  if (status === "anonymous") {
    return <AdminLogin />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
