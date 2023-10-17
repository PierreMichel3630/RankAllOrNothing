import { Profile } from "./Profile";

export interface Review {
  id: number;
  user_uuid: Profile;
  rank: number;
  opinion: string;
  notation: number;
  created_at: Date;
}
