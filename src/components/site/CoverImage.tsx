import { cn } from "@/lib/utils";

/**
 * Cover art for notes / case studies. When no image has been uploaded in the
 * admin, falls back to a branded tile instead of a random stock photo.
 */
export function CoverImage({
  src,
  alt = "",
  label,
  className,
}: {
  src: string | null | undefined;
  alt?: string;
  label?: string;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div
      aria-hidden
      className={cn("flex items-center justify-center bg-brand-soft", className)}
    >
      <span className="font-display text-2xl font-extrabold tracking-tight text-brand/35 uppercase">
        {(label ?? "Pias").slice(0, 2)}
      </span>
    </div>
  );
}
