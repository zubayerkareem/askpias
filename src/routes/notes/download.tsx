import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Download, Loader2, XCircle } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useVerifyLeadMagnetPayment } from "@/hooks/use-lead-magnet-payment";

type DownloadSearch = {
  slug: string;
  invoice_id: string;
  result?: "cancel" | undefined;
};

// UddoktaPay redirects here with ?invoice_id=... after checkout, or to
// ?result=cancel&slug=... when the visitor cancels.
export const Route = createFileRoute("/notes/download")({
  validateSearch: (search: Record<string, unknown>): DownloadSearch => ({
    slug: typeof search["slug"] === "string" ? search["slug"] : "",
    invoice_id: typeof search["invoice_id"] === "string" ? search["invoice_id"] : "",
    result: search["result"] === "cancel" ? "cancel" : undefined,
  }),
  component: PaymentReturnPage,
});

function PaymentReturnPage() {
  const { slug: searchSlug, invoice_id, result } = Route.useSearch();

  const cancelled = result === "cancel" || !invoice_id;
  const verify = useVerifyLeadMagnetPayment(cancelled ? null : invoice_id);
  const slug = verify.data?.slug ?? searchSlug;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          {cancelled ? (
            <FailureState slug={slug} message="Payment was cancelled." />
          ) : verify.isPending ? (
            <div className="rounded-2xl border border-border panel-card p-8">
              <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
              <p className="mt-3 font-medium">Confirming your payment...</p>
            </div>
          ) : verify.data?.status === "pending" ? (
            <div className="rounded-2xl border border-border panel-card p-8">
              <Clock className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-3 font-medium">Your payment is being reviewed.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Refresh this page in a few minutes to get your download.
              </p>
            </div>
          ) : verify.isError || verify.data?.status !== "success" ? (
            <FailureState slug={slug} message="We couldn't confirm your payment." />
          ) : (
            <div className="rounded-2xl border border-border panel-card p-8">
              <p className="font-medium">Payment confirmed — your download is ready.</p>
              {verify.data.fileUrl && (
                <a
                  href={verify.data.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="size-4" />
                  {verify.data.ctaLabel || "Download"}
                </a>
              )}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function FailureState({ slug, message }: { slug: string; message: string }) {
  return (
    <div className="rounded-2xl border border-border panel-card p-8">
      <XCircle className="mx-auto size-6 text-destructive" />
      <p className="mt-3 font-medium">{message}</p>
      {slug ? (
        <Link
          to="/notes/$slug"
          params={{ slug }}
          className="mt-4 inline-block text-sm font-semibold text-accent"
        >
          ← Back to try again
        </Link>
      ) : (
        <Link to="/notes" className="mt-4 inline-block text-sm font-semibold text-accent">
          ← All notes
        </Link>
      )}
    </div>
  );
}
