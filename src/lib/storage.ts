import { supabase } from "@/lib/supabase";

const BUCKET = "media";

/** Uploads a file to the shared `media` storage bucket and returns its public URL. */
export async function uploadMedia(
  file: File,
  folder: "hero" | "notes" | "case-studies",
  prefix?: string,
): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const path = `${folder}/${prefix ? `${prefix}-` : ""}${Date.now()}-${cleanName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
