import { PersonCastTv } from "./PersonCastTv";
import { PersonCredits } from "./PersonCredits";

export interface PersonCreditsTv extends PersonCredits {
  cast: Array<PersonCastTv>;
}
