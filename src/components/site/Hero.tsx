import { useState } from "react";
import { Award, CalendarDays, Play, Users } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { youtubeEmbedUrl, youtubeId } from "@/lib/video";
import { analytics } from "@/lib/analytics";

export function Hero() {
  const { data: settings } = useSiteSettings();
  const [playing, setPlaying] = useState(false);

  const embed = youtubeEmbedUrl(settings?.intro_video_url);
  const videoId = youtubeId(settings?.intro_video_url);
  const poster = videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : null;
  const hasVideo = Boolean(embed);

  return (
    <section
      className={`grid gap-8 border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20 ${
        hasVideo ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-12" : ""
      }`}
    >
      {/* Headline — first on every screen */}
      <div className={hasVideo ? "lg:col-start-1 lg:row-start-1 lg:self-end" : ""}>
        <h1 className="font-display text-[clamp(2.2rem,3.6vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.04em]">
          Building businesses.
          <br />
          Sharing what works.
        </h1>
      </div>

      {/* Video — only when a YouTube URL is configured in site settings */}
      {hasVideo && (
        <figure className="overflow-hidden rounded-xl border border-line bg-page lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="relative aspect-video bg-black">
            {playing && embed ? (
              <iframe
                src={`${embed}&autoplay=1`}
                title="Pias Ahmed"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {poster && (
                  <img
                    src={poster}
                    alt="Pias Ahmed"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                <button
                  type="button"
                  onClick={() => {
                    analytics.cta("play_intro_video", "hero");
                    setPlaying(true);
                  }}
                  aria-label="Play intro video"
                  className="absolute inset-0 grid place-items-center bg-black/20 transition-colors hover:bg-black/35"
                >
                  <span className="grid size-16 place-items-center rounded-full bg-white/95 text-brand shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] transition-transform hover:scale-105">
                    <Play className="ml-0.5 size-6 fill-current" aria-hidden />
                  </span>
                </button>
              </>
            )}
          </div>

          <figcaption className="border-t border-line px-4 py-3">
            <p className="font-display text-sm font-semibold">Pias Ahmed</p>
          </figcaption>
        </figure>
      )}

      {/* Intro copy, CTAs and stats */}
      <div className={hasVideo ? "lg:col-start-1 lg:row-start-2 lg:self-start" : ""}>
        <p className="max-w-[48ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          I&apos;m Pias — a founder and marketer with 5 years of experience helping brands grow. I
          build digital products and share what I learn along the way.
        </p>

        <div className="mt-7 flex flex-row gap-2 sm:gap-3">
          <a
            href="/booking"
            onClick={() => analytics.cta("book_strategy_call", "hero")}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-3 text-[0.8rem] font-bold whitespace-nowrap text-brand-foreground transition-colors hover:bg-brand/90 sm:flex-none sm:gap-2 sm:px-5 sm:text-sm"
          >
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            Book a call
          </a>
          <a
            href="#books"
            onClick={() => analytics.cta("explore_books", "hero")}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-page px-3 py-3 text-[0.8rem] font-bold whitespace-nowrap transition-colors hover:bg-surface sm:flex-none sm:px-5 sm:text-sm"
          >
            Explore my books
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Award className="size-4" aria-hidden />5 Years in Marketing
          </span>
          <span aria-hidden className="hidden h-4 w-px bg-line sm:block" />
          <span className="inline-flex items-center gap-2">
            <Users className="size-4" aria-hidden />
            20+ Brands Worked With
          </span>
        </div>
      </div>
    </section>
  );
}
