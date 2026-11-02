import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useProjects } from "@/hooks/use-projects";
import { projectIcon } from "@/lib/project-icons";
import { analytics } from "@/lib/analytics";

const fallback = [
  {
    slug: "oopscode",
    name: "OopsCode",
    kicker: "Web & software development",
    summary: "Custom websites, web apps and software products for ambitious teams.",
    icon: "code",
  },
  {
    slug: "branding-curve",
    name: "Branding Curve",
    kicker: "Marketing & brand growth",
    summary: "Strategy, content and growth systems for modern brands.",
    icon: "pen",
  },
  {
    slug: "ads-gpt",
    name: "ADS GPT",
    kicker: "Digital marketing",
    summary: "Tools, resources and done-for-you solutions for better advertising.",
    icon: "chart",
  },
];

export function Building() {
  const { data } = useProjects();
  const items = data && data.length > 0 ? data : fallback;

  return (
    <section id="building" className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
        What I&apos;m building
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((p) => {
          const Icon = projectIcon(p.icon);

          return (
            <Link
              key={p.slug}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              onClick={() => analytics.cta(p.name, "building")}
              className="group flex items-start gap-4 rounded-xl border border-line bg-page p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-5" aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-base font-bold">{p.name}</p>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="text-sm text-muted-foreground">{p.kicker}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
