export interface TwitchChannel {
  broadcaster_language: string;
  broadcaster_login: string;
  display_name: string;
  is_live: boolean;
  thumbnail_url: string;
  id: string;
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: Date;
}

export interface TwitchBadges {
  set_id: string;
  versions: Array<VersionTwitch>;
}

export interface VersionTwitch {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  title: string;
  description: string;
  click_action: string;
}

export interface TwitchSchedule {
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_login: string;
  segments: Array<TwitchSegment>;
}

export interface TwitchSegment {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  category: TwitchCategory;
}

export interface TwitchCategory {
  id: string;
  name: string;
}

export interface TwitchPagination {
  cursor?: string;
}

export interface TwitchResults<T> {
  data: Array<T>;
  pagination: TwitchPagination;
}

export interface TwitchResult<T> {
  data: T;
  pagination: TwitchPagination;
}
