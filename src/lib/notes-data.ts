export type Note = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML authored in the Filament rich editor
  image_url: string | null;
  lead_magnet_file_url: string | null; // null => no lead magnet attached
  lead_magnet_cta_label: string | null; // null => client falls back to "Download"
  lead_magnet_payment_required: boolean;
  lead_magnet_price: number | null; // BDT
  featured: boolean;
  locked: boolean;
  published_at: string; // YYYY-MM-DD
  sort_order: number;
  created_at: string;
  updated_at: string;
};
