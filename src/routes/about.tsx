import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { PageHeader } from "@/components/site/PageHeader";
import { PageBlocks } from "@/components/site/PageBlocks";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageBySlugQueryOptions } from "@/hooks/use-pages";

const fallbackTitle = "About Pias Ahmed — Brand Builder & Marketing Consultant";
const fallbackDescription =
  "Pias Ahmed is a brand builder and growth marketer in Dhaka, founder of Branding Curve. Strategy, performance media and conversion systems for brands that want to scale.";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(pageBySlugQueryOptions("about")).catch(() => null);
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? fallbackTitle;
    const description = loaderData?.meta_description ?? fallbackDescription;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://askpias.com/about" },
      ],
      links: [{ rel: "canonical", href: "https://askpias.com/about" }],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const page = Route.useLoaderData();
  const blocks = page?.blocks ?? [];

  return (
    <PageShell>
      {blocks.length > 0 ? (
        <PageBlocks blocks={blocks} />
      ) : (
        <PageHeader label="About" title="I build marketing systems that grow businesses">
          I&apos;m Pias Ahmed — a brand builder and growth marketer based in Dhaka, and the founder
          of Branding Curve. I help founders turn scattered marketing into a system that compounds.
        </PageHeader>
      )}

      <SiteFooter />
    </PageShell>
  );
}
