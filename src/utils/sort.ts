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
