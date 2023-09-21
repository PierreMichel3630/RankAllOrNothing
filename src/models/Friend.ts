import { Profile } from "./Profile";

export interface Friend {
  id: string;
  user1: Profile;
  user2: Profile;
  isvalid: boolean;
  created_at: Date;
}

export interface FriendInsert {
  user1: string;
  user2: string;
}

export interface FriendUpdate {
  id: string;
  isvalid: boolean;
}
