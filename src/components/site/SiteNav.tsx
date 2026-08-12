import { Calendar, Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeToggle } from "@/components/site/ThemeToggle";

const hashLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#services", label: "Services" },
];

const routeLinks = [
  { to: "/case-studies", label: "Case studies" },
  { to: "/notes", label: "Notes" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 text-lg font-bold tracking-tight">
          <img
            src="/pias-islam.jpg"
            alt="Pias Ahmed"
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full border border-border object-cover"
          />
          <span className="truncate">
            Pias <span className="text-primary">Ahmed</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {hashLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          {routeLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground" }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>

        <a
          href="/booking"
          className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
        >
          <Calendar className="size-4" />
          Book a meeting
        </a>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border px-5 py-4 md:hidden">
          {hashLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-muted-foreground"
            >
              {l.label}
            </a>
          ))}
          {routeLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-muted-foreground"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/booking"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            <Calendar className="size-4" />
            Book a meeting
          </a>
        </nav>
      )}
    </header>
  );
}
