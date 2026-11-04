import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { SiteAvatar } from "@/components/site/SiteAvatar";
import type {
  CtaBlock,
  HeroBlock,
  PageBlock,
  PracticeBlock,
  StatsBlock,
  StoryBlock,
} from "@/hooks/use-pages";

const sectionClass = "border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20";

/**
 * Renders the About page from the blocks configured in the admin
 * (Content → Pages). Unknown block types are ignored.
 */
export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "hero":
            return <Hero key={index} block={block} />;
          case "story":
            return <Story key={index} block={block} />;
          case "practice":
            return <Practice key={index} block={block} />;
          case "stats":
            return <Stats key={index} block={block} />;
          case "cta":
            return <Cta key={index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}

function Hero({ block }: { block: HeroBlock }) {
  const { label, heading, body } = block.data;

  return (
    <PageHeader label={label ?? ""} title={heading}>
      {body}
    </PageHeader>
  );
}

function Story({ block }: { block: StoryBlock }) {
  const { heading, body, image, caption_name, caption_location, facts } = block.data;

  return (
    <section className={sectionClass}>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <figure className="mx-auto w-full max-w-[320px] lg:max-w-none">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            {image ? (
              <img
                src={image}
                alt={caption_name ?? "Pias Ahmed"}
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <SiteAvatar
                alt={caption_name ?? "Pias Ahmed"}
                width={900}
                height={1125}
                className="aspect-[4/5] w-full object-cover"
              />
            )}
          </div>
          {(caption_name || caption_location) && (
            <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 border-t border-line pt-3">
              {caption_name && (
                <span className="font-display text-sm font-semibold">{caption_name}</span>
              )}
              {caption_location && (
                <span className="text-xs text-muted-foreground">{caption_location}</span>
              )}
            </figcaption>
          )}
        </figure>

        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {heading}
          </h2>

          {body && (
            // Safe: admin-authored HTML, same handling as note bodies.
            <div
              className="prose prose-neutral mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted-foreground dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}

          {facts && facts.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              {facts.map((fact) => (
                <span
                  key={`${fact.value}-${fact.label}`}
                  className="inline-flex items-baseline gap-2 text-sm text-muted-foreground"
                >
                  <span className="font-display text-base font-bold text-foreground">
                    {fact.value}
                  </span>
                  {fact.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Practice({ block }: { block: PracticeBlock }) {
  const { heading, items } = block.data;
  const cards = Array.isArray(items) ? items : [];

  return (
    <section className={sectionClass}>
      <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{heading}</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <div key={item.title} className="overflow-hidden rounded-xl border border-line bg-page">
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="aspect-[4/3] w-full border-b border-line object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="font-display text-base font-bold">{item.title}</h3>
              {item.body && (
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats({ block }: { block: StatsBlock }) {
  const items = Array.isArray(block.data.items) ? block.data.items : [];

  if (items.length === 0) return null;

  return (
    <section className={sectionClass}>
      <dl className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={`${item.value}-${item.label}`}
            className="rounded-xl border border-line bg-page p-5"
          >
            <dt className="font-display text-3xl font-extrabold tracking-tight">{item.value}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Cta({ block }: { block: CtaBlock }) {
  const { heading, body, primary_label, primary_url, secondary_label, secondary_url } = block.data;

  return (
    <section className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">{heading}</h2>
          {body && (
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>
          )}
        </div>
        {(primary_label || secondary_label) && (
          <div className="flex flex-wrap gap-3">
            {primary_label && primary_url && (
              <a
                href={primary_url}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
              >
                {primary_label}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            )}
            {secondary_label && secondary_url && (
              <a
                href={secondary_url}
                className="inline-flex items-center rounded-lg border border-line px-5 py-3 text-sm font-bold transition-colors hover:bg-surface"
              >
                {secondary_label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
