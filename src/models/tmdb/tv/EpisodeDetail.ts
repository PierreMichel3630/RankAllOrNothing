import { Crew } from "../commun/Crew";
import { GuestStar } from "../commun/GuestStar";
import { Episode } from "./Episode";

export interface EpisodeDetail extends Episode {
  guest_stars: Array<GuestStar>;
  crew: Array<Crew>;
}
