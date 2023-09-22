import { supabase } from "../supabase";

export const SUPABASE_CATEGORY_TABLE = "category";

export const getCategories = (search: string, languageIso: string) =>
  supabase
    .from(SUPABASE_CATEGORY_TABLE)
    .select()
    .ilike(`name->>${languageIso}`, `%${search}%`);
