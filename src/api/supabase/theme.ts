import { ThemeInsert } from "src/models/Theme";
import { supabase } from "../supabase";

export const SUPABASE_THEME_TABLE = "theme";

export const getThemes = (
  search: string,
  languageIso: string,
  categories: Array<number>
) =>
  categories.length > 0
    ? supabase
        .from(SUPABASE_THEME_TABLE)
        .select()
        .ilike(`name->>${languageIso}`, `%${search}%`)
        .in("category", categories)
        .order(`name->>${languageIso}`)
    : supabase
        .from(SUPABASE_THEME_TABLE)
        .select()
        .ilike(`name->>${languageIso}`, `%${search}%`)
        .order(`name->>${languageIso}`);

export const getAllThemes = () => supabase.from(SUPABASE_THEME_TABLE).select();

export const getThemeById = (id: number) =>
  supabase.from(SUPABASE_THEME_TABLE).select().eq("id", id).single();

export const insertTheme = (theme: ThemeInsert) =>
  supabase.from(SUPABASE_THEME_TABLE).insert(theme).select().single();
