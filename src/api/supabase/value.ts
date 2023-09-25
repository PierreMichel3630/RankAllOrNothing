import { ValueInsert } from "src/models/Value";
import { supabase } from "../supabase";

export const SUPABASE_VALUE_TABLE = "value";

export const getValuesByTheme = async (
  idTheme: number,
  search: string,
  languageIso: string
) =>
  search !== ""
    ? supabase
        .from(SUPABASE_VALUE_TABLE)
        .select()
        .eq("theme", idTheme)
        .ilike(`name->>${languageIso}`, `%${search}%`)
    : supabase.from(SUPABASE_VALUE_TABLE).select().eq("theme", idTheme);

export const countValueByTheme = (idTheme: number) => {
  return supabase
    .from(SUPABASE_VALUE_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("theme", idTheme);
};

export const insertValue = (value: ValueInsert) =>
  supabase.from(SUPABASE_VALUE_TABLE).insert(value).select().single();

export const nextIdValue = () =>
  supabase
    .from(SUPABASE_VALUE_TABLE)
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .single();
