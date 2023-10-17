export interface Profile {
  id: string;
  username: string;
  avatar: string | null;
  ispublic: boolean;
  created_at: Date;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  ispublic?: boolean;
  avatar?: string | null;
}
