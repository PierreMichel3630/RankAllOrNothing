import { EpisodeDetail } from "./EpisodeDetail";
import { Season } from "./Season";

export interface SeasonDetail extends Season {
  episodes: Array<EpisodeDetail>;
}
