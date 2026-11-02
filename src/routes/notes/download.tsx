import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, Clock, Download, Loader2, XCircle } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useVerifyPayment } from "@/hooks/use-payments";
import { analytics } from "@/lib/analytics";

type DownloadSearch = {
  slug?: string | undefined;
  invoice_id?: string | undefined;
  result?: "cancel" | undefined;
};

export const Route = createFileRoute("/notes/download")({
  validateSearch: (search: Record<string, unknown>): DownloadSearch => ({
    slug: typeof search["slug"] === "string" ? search["slug"] : undefined,
    invoice_id: typeof search["invoice_id"] === "string" ? search["invoice_id"] : undefined,
    result: search["result"] === "cancel" ? "cancel" : undefined,
  }),
  head: () => ({
    meta: [{ title: "Your download | Pias Ahmed" }, { name: "robots", content: "noindex" }],
  }),
  component: PaymentReturn,
});

function PaymentReturn() {
  const { slug, invoice_id, result } = Route.useSearch();
  const cancelled = result === "cancel" || !invoice_id;

  const verify = useVerifyPayment(cancelled ? null : invoice_id);
  const data = verify.data;

  useEffect(() => {
    if (data?.status !== "paid") return;

    analytics.purchase(
      invoice_id ?? "",
      data.amount ?? 0,
      [
        {
          item_id: data.note_slug ?? "lead-magnet",
          item_name: data.note_title ?? "Lead magnet",
          item_category: "lead_magnet",
          price: data.amount ?? 0,
        },
      ],
    );
  }, [data?.status, invoice_id, data?.amount, data?.note_slug, data?.note_title]);

  const backHref = slug ? `/notes/${slug}` : "/notes";

  return (
    <PageShell>
      <section className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-[560px] rounded-xl border border-line bg-page p-7 text-center sm:p-9">
          {cancelled ? (
            <>
              <XCircle className="mx-auto size-7 text-destructive" />
              <h1 className="mt-4 font-display text-xl font-extrabold">Payment cancelled</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                No payment was taken. You can try again whenever you&apos;re ready.
              </p>
              <a
                href={backHref}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
              >
                Back to the note
              </a>
            </>
          ) : verify.isPending ? (
            <>
              <Loader2 className="mx-auto size-7 animate-spin text-brand" />
              <h1 className="mt-4 font-display text-xl font-extrabold">Confirming your payment…</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This only takes a moment. Please don&apos;t close this page.
              </p>
            </>
          ) : data?.status === "paid" ? (
            <>
              <CheckCircle2 className="mx-auto size-8 text-brand" />
              <h1 className="mt-4 font-display text-xl font-extrabold">Payment confirmed</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks{data.amount ? ` for the ৳${data.amount} payment` : ""} — your download is
                ready.
              </p>
              {data.download_url ? (
                <a
                  href={data.download_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
                >
                  <Download className="size-4" />
                  Download now
                </a>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  The file hasn&apos;t been attached yet — I&apos;ll email it to you shortly.
                </p>
              )}
              <p className="mt-4">
                <a href={backHref} className="text-sm font-semibold text-brand">
                  Back to the note
                </a>
              </p>
            </>
          ) : data?.status === "pending" ? (
            <>
              <Clock className="mx-auto size-7 text-amber-500" />
              <h1 className="mt-4 font-display text-xl font-extrabold">
                Payment is being reviewed
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We haven&apos;t received confirmation from the gateway yet. Refresh this page in a
                minute or two.
              </p>
              <button
                type="button"
                onClick={() => verify.refetch()}
                className="mt-6 inline-flex items-center justify-center rounded-lg border border-line px-5 py-3 text-sm font-bold transition-colors hover:bg-surface"
              >
                Check again
              </button>
            </>
          ) : (
            <>
              <XCircle className="mx-auto size-7 text-destructive" />
              <h1 className="mt-4 font-display text-xl font-extrabold">
                We couldn&apos;t confirm the payment
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                If money left your account, email{" "}
                <a
                  href="mailto:pias@askpias.com"
                  className="font-semibold text-brand underline underline-offset-2"
                >
                  pias@askpias.com
                </a>{" "}
                with the invoice id and I&apos;ll sort it out.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Invoice: {invoice_id}</p>
              <a
                href={backHref}
                className="mt-6 inline-flex items-center justify-center rounded-lg border border-line px-5 py-3 text-sm font-bold transition-colors hover:bg-surface"
              >
                Back to the note
              </a>
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
