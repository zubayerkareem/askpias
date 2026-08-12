import { Facebook, Linkedin, Mail, Youtube } from "lucide-react";

const columns = [
  {
    title: "Quick links",
    items: [
      { label: "Home", href: "/#home" },
      { label: "My story", href: "/#story" },
      { label: "Services", href: "/#services" },
      { label: "Book a meeting", href: "/booking" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Case studies", href: "/case-studies" },
      { label: "Notes", href: "/notes" },
      { label: "FAQ", href: "/faqs" },
    ],
  },
];


export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2.5 text-lg font-bold">
            <img
              src="/pias-islam.jpg"
              alt="Pias Ahmed"
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full border border-border object-cover"
            />
            <span>
              Pias <span className="text-primary">Ahmed</span>
            </span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Brand builder and marketing consultant.
            <br />
            Marketing systems, not marketing tricks.
          </p>
        </div>

        {columns.map((c) => (
          <nav key={c.title}>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((i) => (
                <li key={i.label}>
                  <a
                    href={i.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-semibold">Stay connected</h3>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4" />
            pias@askpias.com
          </p>
          <div className="mt-4 flex gap-3">
            {[Linkedin, Facebook, Youtube, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#booking"
                aria-label="Social link"
                className="inline-flex size-10 items-center justify-center rounded-full bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border px-5 py-5 text-center text-xs text-muted-foreground">
        © 2026 Pias Ahmed. All rights reserved.
      </div>
    </footer>
  );
}
