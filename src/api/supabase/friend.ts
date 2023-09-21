import { FriendInsert, FriendUpdate } from "src/models/Friend";
import { supabase } from "../supabase";

export const SUPABASE_FRIEND_TABLE = "friend";

export const insertFriend = (value: FriendInsert) =>
  supabase.from(SUPABASE_FRIEND_TABLE).insert(value);

export const selectFriend = (isvalid?: boolean) =>
  isvalid !== undefined
    ? supabase
        .from(SUPABASE_FRIEND_TABLE)
        .select("*, user1!inner(*), user2!inner(*)")
        .eq("isvalid", isvalid)
    : supabase
        .from(SUPABASE_FRIEND_TABLE)
        .select("*, user1!inner(*), user2!inner(*)");

export const deleteFriend = (id: string) =>
  supabase.from(SUPABASE_FRIEND_TABLE).delete().eq("id", id);

export const updateFriend = (value: FriendUpdate) =>
  supabase.from(SUPABASE_FRIEND_TABLE).update(value).eq("id", value.id);
