export interface Profile {
  id: string;
  username: string;
  avatar: string | null;
  created_at: Date;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  avatar?: string | null;
}
