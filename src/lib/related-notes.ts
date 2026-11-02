import type { Note } from "@/lib/notes-data";

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "your", "you", "that", "this", "are", "was", "were",
  "not", "from", "what", "when", "why", "how", "its", "it's", "a", "an", "to", "of",
  "in", "on", "is", "be", "do", "does", "can", "will", "they", "their", "them", "we",
  "our", "i", "my", "me", "more", "than", "into", "just", "after", "before", "over",
]);

function keywords(text: string | null | undefined): Set<string> {
  if (!text) return new Set();

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !STOP_WORDS.has(word)),
  );
}

/**
 * Picks related posts: notes sharing keywords with the current one first,
 * then the most recent remaining ones.
 */
export function pickRelatedNotes(current: Note, all: Note[], count = 3): Note[] {
  const currentWords = keywords(`${current.title} ${current.excerpt}`);

  const scored = all
    .filter((note) => note.slug !== current.slug)
    .map((note) => {
      const words = keywords(`${note.title} ${note.excerpt}`);
      let score = 0;
      words.forEach((word) => {
        if (currentWords.has(word)) score += 1;
      });

      return { note, score };
    });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.note.published_at).getTime() - new Date(a.note.published_at).getTime();
  });

  return scored.slice(0, count).map((entry) => entry.note);
}
