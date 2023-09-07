import { PersonDetails } from "src/models/tmdb/person/PersonDetails";
import { getRequestOptions } from "./commun";
import { PersonImage } from "src/models/tmdb/person/PersonImage";
import {
  SearchResult,
  SearchResultGeneric,
} from "src/models/tmdb/commun/SearchResult";
import { PersonCreditsMovie } from "src/models/tmdb/person/PersonCreditsMovie";
import { PersonCreditsTv } from "src/models/tmdb/person/PersonCreditsTv";
import { PersonSearchElement } from "src/models/tmdb/person/PersonSearchElement";

export const getPersonDetails = (
  id: number,
  language: string
): Promise<PersonDetails> => {
  const url = `https://api.themoviedb.org/3/person/${id}?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getPersonMovieCredit = (
  id: number,
  language: string
): Promise<PersonCreditsMovie> => {
  const url = `https://api.themoviedb.org/3/person/${id}/movie_credits?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getPersonTVCredit = (
  id: number,
  language: string
): Promise<PersonCreditsTv> => {
  const url = `https://api.themoviedb.org/3/person/${id}/tv_credits?language=${language}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getPersonExternalId = (id: number): Promise<ExternalId> => {
  const url = `https://api.themoviedb.org/3/person/${id}/external_ids`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getPersonImage = (id: number): Promise<PersonImage> => {
  let url = `https://api.themoviedb.org/3/person/${id}/images`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const getPersonTrending = (
  page: number,
  language: string
): Promise<SearchResult> => {
  const url = `https://api.themoviedb.org/3/trending/person/week?language=${language}&page=${page}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};

export const searchPerson = (
  query: string,
  language: string,
  page: number
): Promise<SearchResultGeneric<PersonSearchElement>> => {
  const url = `https://api.themoviedb.org/3/search/person?query=${query}&language=${language}&page=${page}`;
  return fetch(url, getRequestOptions).then((res) => res.json());
};
