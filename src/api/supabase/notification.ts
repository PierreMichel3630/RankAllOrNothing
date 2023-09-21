import { supabase } from "../supabase";

export const SUPABASE_NOTIFICATION_TABLE = "notification";

export const selectNotification = () =>
  supabase.from(SUPABASE_NOTIFICATION_TABLE).select().limit(5);

export const countNotificationNotRead = () =>
  supabase
    .from(SUPABASE_NOTIFICATION_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("isread", false);

export const updateReadAllNotification = () =>
  supabase.rpc("read_all_notification");
