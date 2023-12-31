import moment from "moment";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { Language } from "src/models/Language";

export const sortByRank = (a: any, b: any) => (a.rank > b.rank ? 1 : -1);

export const sortByPopularity = (a: any, b: any) =>
  a.popularity > b.popularity ? -1 : 1;

export const sortByReleaseYear = (a: any, b: any) =>
  moment(a.release_date).format("YYYY") > moment(b.release_date).format("YYYY")
    ? -1
    : 1;

export const sortByFirstAirDate = (a: any, b: any) =>
  moment(a.first_air_date).format("YYYY") >
  moment(b.first_air_date).format("YYYY")
    ? -1
    : 1;

export const sortByDateDesc = (a: any, b: any) =>
  moment(a.date).format("YYYY") > moment(b.date).format("YYYY") ? 1 : -1;

export const sortByTotalEpisodeCount = (a: any, b: any) =>
  a.total_episode_count > b.total_episode_count ? -1 : 1;

export const sortByEpisodeNumber = (a: any, b: any) =>
  a.episode_number > b.episode_number ? 1 : -1;

export const sortByTrads = (a: any, b: any, language: Language) => {
  const nameLocalLanguageA = a.name[language.iso];
  const nameEnglishA = a.name[DEFAULT_ISO_LANGUAGE];
  const nameA = nameLocalLanguageA ? nameLocalLanguageA : nameEnglishA;

  const nameLocalLanguageB = b.name[language.iso];
  const nameEnglishB = b.name[DEFAULT_ISO_LANGUAGE];
  const nameB = nameLocalLanguageB ? nameLocalLanguageB : nameEnglishB;
  return nameA && nameB ? nameA.localeCompare(nameB) : -1;
};

export const sortByUsername = (a: any, b: any) =>
  a.username > b.username ? 1 : -1;

export const sortByDiff = (a: any, b: any) => {
  if (a.diff === null) {
    return 1;
  }

  if (b.diff === null) {
    return -1;
  }

  if (a.diff === b.diff) {
    return 0;
  }

  return a.diff < b.diff ? 1 : -1;
};

export const sortByName = (a: any, b: any) => (a.name > b.name ? 1 : -1);

export const sortByDisplayName = (a: any, b: any) =>
  a.display_name > b.display_name ? 1 : -1;
