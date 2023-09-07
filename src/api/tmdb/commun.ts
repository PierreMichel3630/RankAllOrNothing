import { Filter } from "src/models/tmdb/commun/Filter";
import { Genres } from "src/models/tmdb/commun/Genres";
import { SearchResult } from "src/models/tmdb/commun/SearchResult";
import { MediaType } from "src/models/tmdb/enum";

export const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjZjYTY3NDEyY2U3MzA4MGE4YWM1YzhjMDQwOTZiNSIsInN1YiI6IjY0YmJkY2M0ZWI3OWMyMDExYzI0ZTEwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0geOpDej0t0qVeEp5qvXPv-UW9ao9Cmfkv2aQYyF_UA";

export const getRequestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

// SEARCH
export const searchAll = (
  query: string,
  language: string,
  page: number,
  type?: MediaType
): Promise<SearchResult> => {
  const typeUrl = type ? type : "multi";
  const url = `https://api.themoviedb.org/3/search/${typeUrl}?query=${query}&language=${language}&page=${page}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

// GENRE

export const getMovieGenre = (language: string): Promise<Genres> => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getTvGenre = (language: string): Promise<Genres> => {
  const url = `https://api.themoviedb.org/3/genre/tv/list?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

// TRENDING

export const getTrending = (
  page: number,
  language: string
): Promise<SearchResult> => {
  const url = `https://api.themoviedb.org/3/trending/all/week?language=${language}&page=${page}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

// DISCOVER

export const dicoverAll = (
  page: number,
  language: string,
  filter: Filter
): Promise<SearchResult> => {
  let url = `https://api.themoviedb.org/3/discover/${filter.type}?language=${language}&page=${page}`;
  if (filter.sort) {
    url = url + `&sort_by=${filter.sort}`;
  }
  if (filter.withgenres.length > 0) {
    url = url + `&with_genres=${filter.withgenres.join(",")}`;
  }
  if (filter.withoutgenres.length > 0) {
    url = url + `&without_genres=${filter.withoutgenres.join(",")}`;
  }
  if (filter.actors.length > 0) {
    url = url + `&with_cast=${filter.actors.join(",")}`;
  }
  if (filter.origincountry.length > 0) {
    url = url + `&with_original_language=${filter.origincountry.join(",")}`;
  }
  if (filter.runtime.over) {
    url = url + `&with_runtime.gte=${filter.runtime.over}`;
  }
  if (filter.runtime.under) {
    url = url + `&with_runtime.lte=${filter.runtime.under}`;
  }
  if (filter.vote.over) {
    url = url + `&vote_count.gte=${filter.vote.over}`;
  }
  if (filter.vote.under) {
    url = url + `&vote_average.lte=${filter.vote.under}`;
  }
  if (filter.year.before) {
    url = url + `&release_date.lte=${filter.year.before}`;
  }
  if (filter.year.after) {
    url = url + `&release_date.gte=${filter.year.after}`;
  }
  if (filter.year.exact.length > 0) {
    url = url + `&year=${filter.year.exact.join(",")}`;
  }
  return fetch(url, getRequestOptions).then((res) => res.json());
};
