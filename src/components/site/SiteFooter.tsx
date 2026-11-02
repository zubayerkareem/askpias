import { Facebook, Linkedin, Youtube } from "lucide-react";
import { SiteAvatar } from "@/components/site/SiteAvatar";

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="px-6 py-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <a href="/" className="flex items-center gap-2">
          <SiteAvatar
            alt="Pias Ahmed"
            width={28}
            height={28}
            className="size-7 rounded-full border border-line object-cover"
          />
          <span className="font-display text-xs font-extrabold tracking-[0.14em] uppercase">
            AskPias
          </span>
        </a>

        <div className="flex items-center gap-4 text-muted-foreground">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="transition-colors hover:text-foreground"
            >
              <s.icon className="size-4" aria-hidden />
            </a>
          ))}
          <span aria-hidden className="h-4 w-px bg-line" />
          <a
            href="/booking"
            className="text-xs font-semibold text-brand transition-colors hover:text-brand/80"
          >
            Book a call
          </a>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 AskPias. All rights reserved.</p>
      </div>
    </footer>
  );
}
