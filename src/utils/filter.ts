import moment from "moment";
import { normalizeString } from "./string";

export const filterMovieUpcoming = (el: any) =>
  el.release_date !== null &&
  el.release_date !== "" &&
  moment().diff(el.release_date, "days") > 0;

export const filterTvUpcoming = (el: any) =>
  el.first_air_date !== null &&
  el.first_air_date !== "" &&
  moment().diff(el.first_air_date, "days") > 0;

export const filterMovieAlreadyOut = (el: any) =>
  el.release_date === null ||
  el.release_date === "" ||
  moment().diff(el.release_date, "days") < 0;

export const filterTvAlreadyOut = (el: any) =>
  el.first_air_date === null ||
  el.first_air_date === "" ||
  moment().diff(el.first_air_date, "days") < 0;
