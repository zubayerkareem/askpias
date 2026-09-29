import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Loader2, XCircle } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useVerifyLeadMagnetPayment } from "@/hooks/use-lead-magnet-payment";

type DownloadSearch = {
  slug: string;
  mtid: string;
  result?: "fail" | "cancel" | undefined;
};

export const Route = createFileRoute("/notes/download")({
  validateSearch: (search: Record<string, unknown>): DownloadSearch => ({
    slug: typeof search["slug"] === "string" ? search["slug"] : "",
    mtid: typeof search["mtid"] === "string" ? search["mtid"] : "",
    result:
      search["result"] === "fail" || search["result"] === "cancel" ? search["result"] : undefined,
  }),
  component: PaymentReturnPage,
});

function PaymentReturnPage() {
  const { slug, mtid, result } = Route.useSearch();

  // EPS already told us this attempt failed/was cancelled — no need to
  // spend an extra CheckMerchantTransactionStatus call to learn that.
  const skipVerification = result === "fail" || result === "cancel";
  const verify = useVerifyLeadMagnetPayment(skipVerification ? null : mtid || null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          {skipVerification ? (
            <FailureState
              slug={slug}
              message={
                result === "cancel" ? "Payment was cancelled." : "Payment didn't go through."
              }
            />
          ) : verify.isPending ? (
            <div className="rounded-2xl border border-border panel-card p-8">
              <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
              <p className="mt-3 font-medium">Confirming your payment...</p>
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
