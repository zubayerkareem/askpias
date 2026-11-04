import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { SiteAvatar } from "@/components/site/SiteAvatar";

const routeLinks = [
  { to: "/about", label: "About" },
  { to: "/case-studies", label: "Clients" },
  { to: "/notes", label: "Notes" },
  { to: "/books", label: "Books" },
  { to: "/contact", label: "Contact" },
] as const;

const navLink =
  "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4">
      <nav className="glass mx-auto flex max-w-[1280px] items-center gap-1 rounded-full p-1.5 pl-2.5">
        <Link to="/" className="flex shrink-0 items-center gap-2 pr-2">
          <SiteAvatar
            alt="Pias Ahmed"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full border border-border object-cover"
          />
          <span className="font-display text-sm font-extrabold tracking-tight">Pias Ahmed</span>
        </Link>

        <div className="hidden items-center md:flex">
          {routeLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground font-semibold" }}
              className={navLink}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle className="text-muted-foreground hover:text-foreground" />

          <a
            href="/booking"
            className="hidden items-center gap-1 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 sm:inline-flex"
          >
            Book a call
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <nav className="glass mx-auto mt-2 max-w-[1280px] rounded-3xl p-3 md:hidden">
          {routeLinks.map((l) => (
            <a
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/booking"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-3 text-sm font-bold text-brand-foreground"
          >
            Book a call
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </nav>
      )}
    </header>
  );
}
