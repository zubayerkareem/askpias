// Dummy placeholder thumbnail — used whenever a note/case study has no
// uploaded image_url yet.
export const dummyImage = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

export type Note = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Tiptap HTML output; "" when not yet written
  category: string;
  image_url: string | null;
  lead_magnet_file_url: string | null; // null => no lead magnet attached
  lead_magnet_cta_label: string | null; // null => client falls back to "Download"
  featured: boolean;
  locked: boolean;
  comment_count: number;
  published_at: string; // YYYY-MM-DD
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type NoteInput = Pick<
  Note,
  | "slug"
  | "title"
  | "excerpt"
  | "content"
  | "category"
  | "featured"
  | "locked"
  | "comment_count"
  | "published_at"
  | "sort_order"
> & {
  image_url?: string | null;
  lead_magnet_file_url?: string | null;
  lead_magnet_cta_label?: string | null;
};
