import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Story } from "@/components/site/Story";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";
import { NotesSection } from "@/components/site/NotesSection";
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
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="page-enter">
        <Hero />
        <Story />
        <Services />
        <Testimonials />
        <NotesSection />
        <Booking />
        <AskAnything />
      </main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}
