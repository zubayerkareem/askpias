import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/use-site-settings";
import { uploadMedia } from "@/lib/storage";

export const Route = createFileRoute("/admin/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settings, isPending } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [iframeUrl, setIframeUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setHeroPreview(settings.hero_image_url);
      setIframeUrl(settings.case_studies_iframe_url ?? "");
    }
  }, [settings]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const onSave = async () => {
    try {
      let hero_image_url = settings?.hero_image_url ?? null;
      if (heroFile) {
        hero_image_url = await uploadMedia(heroFile, "hero");
      }
      await updateSettings.mutateAsync({
        hero_image_url,
        case_studies_iframe_url: iframeUrl.trim() || null,
      });
      toast.success("Settings saved.");
      setHeroFile(null);
    } catch {
      toast.error("Couldn't save settings — please try again.");
    }
  };

  if (isPending) {
    return <div className="skeleton-shimmer h-64 w-full rounded-xl" />;
  }

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Site-wide content: your photo and the Case Studies video embed.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Hero photo</Label>
        <p className="text-sm text-muted-foreground">
          Used for the homepage portrait, the nav avatar, and the footer logo.
        </p>
        <div className="flex items-center gap-4">
          <img
            src={heroPreview ?? "/pias-islam.jpg"}
            alt="Hero preview"
            className="size-20 rounded-xl border border-border object-cover"
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Choose photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="iframe-url">Case studies video embed URL</Label>
        <Input
          id="iframe-url"
          value={iframeUrl}
          onChange={(e) => setIframeUrl(e.target.value)}
          placeholder="https://www.facebook.com/plugins/video.php?..."
        />
        {iframeUrl && (
          <div className="aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border border-border">
            <iframe
              src={iframeUrl}
              className="h-full w-full"
              style={{ border: "none" }}
              scrolling="no"
              title="Iframe preview"
            />
          </div>
        )}
      </div>

      <Button type="button" onClick={onSave} disabled={updateSettings.isPending}>
        {updateSettings.isPending ? "Saving..." : "Save settings"}
      </Button>
    </div>
  );
}
