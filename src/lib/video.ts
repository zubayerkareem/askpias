/** Extract a YouTube video id from common URL shapes. */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );

  if (match?.[1]) return match[1];

  return /^[A-Za-z0-9_-]{11}$/.test(url) ? url : null;
}

export function youtubeEmbedUrl(
  url: string | null | undefined,
  options: { autoplay?: boolean } = {},
): string | null {
  const id = youtubeId(url);
  if (!id) return null;

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  if (options.autoplay) params.set("autoplay", "1");

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

/**
 * Turn a paragraph that only contains a YouTube link into a responsive embed.
 * The admin's rich editor inserts these links with its "YouTube" toolbar button.
 */
export function enrichContentHtml(html: string): string {
  if (!html) return html;

  const withEmbeds = html.replace(
    /<p>\s*(?:<br\s*\/?>)?\s*<a [^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>\s*(?:<br\s*\/?>)?\s*<\/p>/gi,
    (match, href: string) => {
      const embed = youtubeEmbedUrl(href);
      if (!embed) return match;

      return `<div class="video-embed"><iframe src="${embed}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    },
  );

  // Every page renders its own <h1>, so rich content starts at <h2>.
  const demoted = withEmbeds.replace(/<h1(\s[^>]*)?>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");

  // Wrap tables so they can scroll on mobile and carry a rounded frame.
  return demoted.replace(
    /<table[\s\S]*?<\/table>/gi,
    (table) => `<div class="article-table">${table}</div>`,
  );
}
