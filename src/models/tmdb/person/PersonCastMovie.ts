import { PersonCast } from "./PersonCast";

export interface PersonCastMovie extends PersonCast {
  release_date: string;
  original_title: string;
  title: string;
}
