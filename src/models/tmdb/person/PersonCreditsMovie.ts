import { PersonCastMovie } from "./PersonCastMovie";
import { PersonCredits } from "./PersonCredits";

export interface PersonCreditsMovie extends PersonCredits {
  cast: Array<PersonCastMovie>;
}
