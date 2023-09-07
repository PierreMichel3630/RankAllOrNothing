import { ThemeInsert, TranslateThemeInsert } from "src/models/Theme";
import { supabase } from "../supabase";
import { DEFAULT_ISO_LANGUAGE } from "./language";

export const SUPABASE_THEME_TABLE = "theme";
export const SUPABASE_TRANSLATETHEME_TABLE = "translatetheme";
export const SUPABASE_THEMEVIEW_TABLE = "themeview";

export const getThemesByName = (search: string, language: string) =>
  supabase
    .from(SUPABASE_TRANSLATETHEME_TABLE)
    .select("*, language!inner(*), theme!inner(*)")
    .in("language.iso", [language, DEFAULT_ISO_LANGUAGE])
    .eq("name", search);

export const getAllThemes = () =>
  supabase.from(SUPABASE_THEMEVIEW_TABLE).select();

export const getThemes = async (search: string, language: string) => {
  if (search !== "") {
    const { data } = await supabase
      .from(SUPABASE_TRANSLATETHEME_TABLE)
      .select("*, language!inner(*), theme!inner(*)")
      .in("language.iso", [language, DEFAULT_ISO_LANGUAGE])
      .ilike("name", `%${search}%`);
    if (data) {
      const ids = data.map((el) => el.theme.id);
      return supabase.from(SUPABASE_THEMEVIEW_TABLE).select().in("id", ids);
    }
  }
  return supabase.from(SUPABASE_THEMEVIEW_TABLE).select();
};

export const getThemeById = (id: number) =>
  supabase.from(SUPABASE_THEMEVIEW_TABLE).select().eq("id", id).single();

export const insertTheme = (theme: ThemeInsert) =>
  supabase.from(SUPABASE_THEME_TABLE).insert(theme).select().single();

export const insertTranslateTheme = (theme: TranslateThemeInsert) =>
  supabase.from(SUPABASE_TRANSLATETHEME_TABLE).insert(theme).select().single();
