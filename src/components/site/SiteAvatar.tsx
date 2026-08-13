import { useSiteSettings } from "@/hooks/use-site-settings";

const FALLBACK_SRC = "/pias-islam.jpg";

/**
 * Shared portrait/logo image — used in the Hero, nav, and footer. Reads the
 * admin-editable hero image from site_settings, falling back to the static
 * file until one is uploaded.
 */
export function SiteAvatar({
  alt,
  width,
  height,
  className,
}: {
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const { data: settings } = useSiteSettings();

  return (
    <img
      src={settings?.hero_image_url ?? FALLBACK_SRC}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
