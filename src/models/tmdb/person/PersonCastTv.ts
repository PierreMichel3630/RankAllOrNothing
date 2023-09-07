import { PersonCast } from "./PersonCast";

export interface PersonCastTv extends PersonCast {
  episode_count: number;
  first_air_date: string;
  original_name: string;
  name: string;
}
