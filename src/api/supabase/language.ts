import { supabase } from "../supabase";

export const SUPABASE_LANGUAGE_TABLE = "language";

export const DEFAULT_ISO_LANGUAGE = "en-GB";

export const getLanguages = () =>
  supabase.from(SUPABASE_LANGUAGE_TABLE).select();
