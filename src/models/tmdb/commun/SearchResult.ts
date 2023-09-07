import { MovieSearchElement } from "../movie/MovieSearchElement";
import { PersonSearchElement } from "../person/PersonSearchElement";
import { TvSearchElement } from "../tv/TvSearchElement";

export interface SearchResult {
  page: number;
  results: Array<MovieSearchElement | PersonSearchElement | TvSearchElement>;
  total_pages: number;
  total_results: number;
}

export interface SearchResultGeneric<T> {
  page: number;
  results: Array<T>;
  total_pages: number;
  total_results: number;
}
