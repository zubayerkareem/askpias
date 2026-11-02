import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { PageShell } from "@/components/site/PageShell";
import { Hero } from "@/components/site/Hero";
import { Building } from "@/components/site/Building";
import { Ebook } from "@/components/site/Ebook";
import { BlogSection } from "@/components/site/BlogSection";
import { Testimonials } from "@/components/site/Testimonials";
import { Booking } from "@/components/site/Booking";
import { AskAnything } from "@/components/site/AskAnything";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "Pias Ahmed — Brand Builder & Marketing Consultant";
const description =
  "I build predictable growth for brands with strategy, performance marketing and conversion systems. Book a 1:1 strategy call with Pias Ahmed.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://askpias.com/" },
    ],
    links: [{ rel: "canonical", href: "https://askpias.com/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <Hero />
      <Building />
      <Ebook />
      <BlogSection />
      <Testimonials />
      <Booking />
      <AskAnything />
      <SiteFooter />
      <Toaster />
    </PageShell>
  );
}
