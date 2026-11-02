import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Skewed accent ribbon that scrolls its items horizontally. The list is
 * rendered twice so the loop is seamless.
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-black/10 bg-brand py-3 sm:py-4",
        className,
      )}
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 px-4 font-display text-base font-extrabold tracking-tight text-brand-foreground sm:text-xl"
          >
            {item}
            <Asterisk className="size-4 shrink-0 sm:size-5" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
