export interface Profile {
  username: string;
  avatar: string;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  avatar?: string;
}
