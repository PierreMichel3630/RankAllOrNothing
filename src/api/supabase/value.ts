import { TranslateValueInsert, ValueInsert } from "src/models/Value";
import { supabase } from "../supabase";

export const SUPABASE_VALUEVIEW_TABLE = "valueview";
export const SUPABASE_VALUE_TABLE = "value";
export const SUPABASE_TRANSLATEVALUE_TABLE = "translatevalue";

export const getValuesByTheme = async (
  idTheme: number,
  search: string,
  language: string
) => {
  if (search !== "") {
    const { data } = await supabase
      .from(SUPABASE_TRANSLATEVALUE_TABLE)
      .select("*, language!inner(*), value!inner(*)")
      .eq("language.iso", language)
      .eq("value.theme", idTheme)
      .ilike("name", `%${search}%`)
      .order("name", { ascending: true });
    if (data) {
      const ids = data.map((el) => el.value.id);
      return supabase.from(SUPABASE_VALUEVIEW_TABLE).select().in("id", ids);
    }
  }

  return supabase.from(SUPABASE_VALUEVIEW_TABLE).select().eq("theme", idTheme);
};

export const countValueByTheme = (idTheme: number) => {
  return supabase
    .from(SUPABASE_VALUEVIEW_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("theme", idTheme);
};

export const insertValue = (value: ValueInsert) =>
  supabase.from(SUPABASE_VALUE_TABLE).insert(value).select().single();

export const insertTranslateValue = (value: TranslateValueInsert) =>
  supabase.from(SUPABASE_TRANSLATEVALUE_TABLE).insert(value).select().single();

export const nextIdValue = () =>
  supabase
    .from(SUPABASE_VALUE_TABLE)
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .single();
