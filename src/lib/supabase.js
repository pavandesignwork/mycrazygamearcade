import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Games ───

export async function getGames() {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getGameById(id) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createGame(game) {
  const { data, error } = await supabase
    .from("games")
    .insert(game)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGame(id, updates) {
  const { data, error } = await supabase
    .from("games")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGame(id) {
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) throw error;
}

// ─── Thumbnail Upload ───

export async function uploadThumbnail(file, fileName) {
  const { data, error } = await supabase.storage
    .from("thumbnails")
    .upload(fileName, file, { upsert: true });
  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("thumbnails")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
