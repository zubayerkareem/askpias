/** Rough reading time for admin HTML, in whole minutes. */
export function readingTime(html: string | null | undefined): number {
  if (!html) return 1;

  const words = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}
