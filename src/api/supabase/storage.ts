import { supabase } from "../supabase";

export const BUCKET_THEME = "theme";
export const BUCKET_VALUE = "value";
export const BUCKET_LANGUAGE = "language";

export const URL_STORAGE =
  "https://cvkiuxywllpahhzjccxd.supabase.co/storage/v1/object/public/";

export const storeFile = (bucket: string, filePath: string, file: File) =>
  supabase.storage.from(bucket).upload(filePath, file);

export const getUrlPublic = (bucket: string, filePath: string) =>
  URL_STORAGE + bucket + "/" + filePath;
