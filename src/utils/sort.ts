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
  const tradLocalLanguageA = a.trads.find((el: any) => el.iso === language.iso);
  const tradEnglishA = a.trads.find(
    (el: any) => el.iso === DEFAULT_ISO_LANGUAGE
  );
  const tradA = tradLocalLanguageA ? tradLocalLanguageA : tradEnglishA;

  const tradLocalLanguageB = b.trads.find((el: any) => el.iso === language.iso);
  const tradEnglishB = b.trads.find(
    (el: any) => el.iso === DEFAULT_ISO_LANGUAGE
  );
  const tradB = tradLocalLanguageB ? tradLocalLanguageB : tradEnglishB;
  return tradA && tradB ? tradA.name.localeCompare(tradB.name) : -1;
};
