import { supabase } from "../../supabase";

export const searchChannelsTwitch = async (
  query: string,
  itemperpage: number,
  after?: string
) =>
  supabase.functions.invoke("search-twitch-channel", {
    body: { query: query, first: itemperpage, after: after },
  });

export const getUserTwitchInformation = async (id: number) =>
  supabase.functions.invoke("get-user-twitch-information", {
    body: { id },
  });

export const getScheduleChannelTwitch = async (id: number) =>
  supabase.functions.invoke("get-schedule-channel-twitch", {
    body: { id },
  });

export const getBadgesChannelTwitch = async (id: number) =>
  supabase.functions.invoke("get-badges-channel-twitch", {
    body: { id },
  });
