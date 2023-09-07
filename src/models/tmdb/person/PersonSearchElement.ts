import { MediaType } from "../enum";

export interface PersonSearchElement {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: Array<KnownFor>;
  media_type: MediaType;
}
