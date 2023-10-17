import { CheckInsert, RankInsert, RankUpdate } from "src/models/Rank";
import { supabase } from "../supabase";

export const SUPABASE_RANK_TABLE = "rank";

export const calculationRank = (
  useruuid: string,
  theme: number,
  notation: number,
  id: undefined | number
) =>
  id
    ? supabase
        .from(SUPABASE_RANK_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("theme", theme)
        .eq("user_uuid", useruuid)
        .not("id", "in", `(${id})`)
        .gt("notation", notation)
    : supabase
        .from(SUPABASE_RANK_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("theme", theme)
        .eq("user_uuid", useruuid)
        .gt("notation", notation);

export const calculationRankType = (
  useruuid: string,
  theme: number,
  notation: number,
  id: undefined | number,
  type: string
) =>
  id
    ? supabase
        .from(SUPABASE_RANK_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("theme", theme)
        .eq("type", type)
        .eq("user_uuid", useruuid)
        .not("id", "in", `(${id})`)
        .gt("notation", notation)
    : supabase
        .from(SUPABASE_RANK_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("theme", theme)
        .eq("type", type)
        .eq("user_uuid", useruuid)
        .gt("notation", notation);

export const countRanksByTheme = (useruuid: string, idTheme: number) => {
  return supabase
    .from(SUPABASE_RANK_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("theme", idTheme)
    .eq("user_uuid", useruuid);
};

export const countRanksByThemeAndType = (
  useruuid: string,
  idTheme: number,
  type: string | null
) => {
  return type !== null
    ? supabase
        .from(SUPABASE_RANK_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("theme", idTheme)
        .eq("type", type)
        .eq("user_uuid", useruuid)
    : supabase
        .from(SUPABASE_RANK_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("theme", idTheme)
        .eq("user_uuid", useruuid);
};

export const getRanksByIdExtern = (
  useruuid: string,
  id: number,
  idTheme: number,
  type: string
) => {
  return supabase
    .from(SUPABASE_RANK_TABLE)
    .select()
    .eq("id_extern", id)
    .eq("theme", idTheme)
    .eq("type", type)
    .eq("user_uuid", useruuid)
    .maybeSingle();
};

export const insertCheck = (value: CheckInsert) =>
  supabase.from(SUPABASE_RANK_TABLE).insert({ ...value });

export const updateRank = (value: RankUpdate) =>
  supabase.from(SUPABASE_RANK_TABLE).update(value).eq("id", value.id);

export const insertRank = (value: RankInsert) =>
  supabase.from(SUPABASE_RANK_TABLE).insert(value);

export const deleteRank = (id: number) =>
  supabase.from(SUPABASE_RANK_TABLE).delete().eq("id", id);

export const getRankByUser = (useruuid: string, idtheme: number) =>
  supabase
    .from(SUPABASE_RANK_TABLE)
    .select("*, value!inner(*)")
    .eq("theme", idtheme)
    .eq("user_uuid", useruuid)
    .order("notation", { ascending: false, nullsFirst: false });

export const getRanksByUserAndThemeAndType = (
  idTheme: number,
  user_uuid: string,
  type: string
) =>
  supabase
    .from(SUPABASE_RANK_TABLE)
    .select()
    .eq("theme", idTheme)
    .eq("user_uuid", user_uuid)
    .eq("type", type)
    .order("notation", { ascending: false, nullsFirst: false });

export const getRanksByValue = (id: number) => {
  return supabase
    .from(SUPABASE_RANK_TABLE)
    .select("*, user_uuid!inner(*)")
    .eq("value", id)
    .not("opinion", "is", null)
    .neq("opinion", "");
};

export const getRanksByIdExternAndType = (id: number, type: string) => {
  return supabase
    .from(SUPABASE_RANK_TABLE)
    .select("*, user_uuid!inner(*)")
    .eq("id_extern", id)
    .eq("type", type)
    .not("opinion", "is", null)
    .neq("opinion", "");
};

export const getMaxRankByTheme = (idTheme: number) => {
  return supabase
    .from(SUPABASE_RANK_TABLE)
    .select("rank")
    .eq("theme", idTheme)
    .order("rank", { ascending: false })
    .limit(1);
};

export const getMaxRankByThemeAndType = (idTheme: number, type: string) => {
  return supabase
    .from(SUPABASE_RANK_TABLE)
    .select("rank")
    .eq("theme", idTheme)
    .eq("type", type)
    .order("rank", { ascending: false })
    .limit(1);
};
