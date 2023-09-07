import { SerieDetails } from "src/models/tmdb/tv/SerieDetails";
import { getRequestOptions } from "./commun";
import { Images } from "src/models/tmdb/commun/Images";
import { SeasonDetail } from "src/models/tmdb/tv/SeasonDetail";
import { EpisodeDetail } from "src/models/tmdb/tv/EpisodeDetail";
import { EpisodeImage } from "src/models/tmdb/tv/EpisodeImage";
import { Videos } from "src/models/tmdb/commun/Videos";
import { SearchResult } from "src/models/tmdb/commun/SearchResult";
import { TvAggregateCredits } from "src/models/tmdb/tv/TvAggregateCredits";
import { TimeTrending } from "src/models/tmdb/enum";

export const getTvDetails = (
  id: number,
  language: string
): Promise<SerieDetails> => {
  const url = `https://api.themoviedb.org/3/tv/${id}?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvCredit = (
  id: number,
  language: string
): Promise<TvAggregateCredits> => {
  const url = `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvImage = (id: number, language?: string): Promise<Images> => {
  let url = `https://api.themoviedb.org/3/tv/${id}/images`;
  if (language) {
    url = url + `?include_image_language=${language}%2Cnull`;
  }
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvSeason = (
  id: number,
  season: number,
  language: string
): Promise<SeasonDetail> => {
  const url = `https://api.themoviedb.org/3/tv/${id}/season/${season}?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvEpisode = (
  id: number,
  season: number,
  episode: number,
  language: string
): Promise<EpisodeDetail> => {
  const url = `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvEpisodeImages = (
  id: number,
  season: number,
  episode: number,
  language: string
): Promise<EpisodeImage> => {
  const url = `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}/images?include_image_language=${language},null`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvEpisodeVideos = (
  id: number,
  season: number,
  episode: number,
  language: string
): Promise<Videos> => {
  const url = `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}/videos?include_image_language=${language},null`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvVideo = (id: number, language: string): Promise<Videos> => {
  const url = `https://api.themoviedb.org/3/tv/${id}/videos?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvTrending = (
  page: number,
  language: string,
  time?: TimeTrending
): Promise<SearchResult> => {
  const url = `https://api.themoviedb.org/3/trending/tv/${
    time ? time : TimeTrending.day
  }?language=${language}&page=${page}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvByGenre = (
  genres: Array<number>,
  page: number,
  language: string
): Promise<SearchResult> => {
  const url = `https://api.themoviedb.org/3/discover/tv?language=${language}&page=${page}&with_genres=${genres.join(
    ","
  )}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};
