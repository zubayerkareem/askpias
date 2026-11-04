import { Facebook, Linkedin, Youtube, type LucideProps } from "lucide-react";
import { SiteAvatar } from "@/components/site/SiteAvatar";

function XIcon(props: LucideProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/pias-ahmed-info" },
  { icon: XIcon, label: "X", href: "https://x.com/askpias" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@askpias" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/askpias" },
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
              target="_blank"
              rel="noopener noreferrer"
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
