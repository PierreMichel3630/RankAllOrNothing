import { Role } from "./Role";

export interface TvAggregateCreditCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  roles: Array<Role>;
  total_episode_count: number;
  order: number;
}
