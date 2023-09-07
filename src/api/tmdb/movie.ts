import { MovieDetails } from "src/models/tmdb/movie/MovieDetails";
import { getRequestOptions } from "./commun";
import { Credits } from "src/models/tmdb/commun/Credits";
import { Images } from "src/models/tmdb/commun/Images";
import { Videos } from "src/models/tmdb/commun/Videos";
import { SearchResult } from "src/models/tmdb/commun/SearchResult";
import { TimeTrending } from "src/models/tmdb/enum";

// MOVIE

export const getMovieDetails = (
  id: number,
  language: string
): Promise<MovieDetails> => {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getMovieCredit = (
  id: number,
  language: string
): Promise<Credits> => {
  const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getMovieImage = (
  id: number,
  language?: string
): Promise<Images> => {
  let url = `https://api.themoviedb.org/3/movie/${id}/images`;
  if (language) {
    url = url + `?include_image_language=${language}%2Cnull`;
  }
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getMovieVideo = (
  id: number,
  language: string
): Promise<Videos> => {
  const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getMovieTrending = (
  page: number,
  language: string,
  time?: TimeTrending
): Promise<SearchResult> => {
  const url = `https://api.themoviedb.org/3/trending/movie/${
    time ? time : TimeTrending.day
  }?language=${language}&page=${page}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getMovieByGenre = (
  genres: Array<number>,
  page: number,
  language: string
): Promise<SearchResult> => {
  const url = `https://api.themoviedb.org/3/discover/movie?language=${language}&page=${page}&with_genres=${genres.join(
    ","
  )}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};
