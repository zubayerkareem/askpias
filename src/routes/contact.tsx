import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactForm } from "@/components/site/ContactForm";

const title = "Contact Pias Ahmed — Marketing Consultant";
const description =
  "Get in touch with Pias Ahmed about marketing strategy, performance ads and growth systems. I reply to every message personally.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <PageHeader label="Contact" title="Tell me what you're stuck on">
        Fill in the form and I&apos;ll reply personally — usually within one business day.
      </PageHeader>

      <section className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">
              Prefer a direct line?
            </h2>

            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <span>
                  <a
                    href="mailto:pias@askpias.com"
                    className="font-semibold text-foreground underline decoration-line underline-offset-4 hover:decoration-brand"
                  >
                    pias@askpias.com
                  </a>
                  <span className="mt-1 block text-muted-foreground">Replies within 24 hours.</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <span>
                  <a href="/booking" className="font-semibold text-foreground underline decoration-line underline-offset-4 hover:decoration-brand">
                    Book a 30-minute call
                  </a>
                  <span className="mt-1 block text-muted-foreground">
                    Straight to the calendar, no back and forth.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="font-semibold text-foreground">Dhaka, Bangladesh</span>
                  <span className="mt-1 block text-muted-foreground">
                    Working with brands worldwide, GMT+6.
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-page p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
