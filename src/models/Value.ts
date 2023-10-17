import { JsonLanguage } from "./Language";

export interface Value {
  id: number;
  image: string;
  theme: number;
  name: JsonLanguage;
  description: JsonLanguage;
}

export interface ValueInsert {
  image: string;
  theme: number;
  name: JsonLanguage;
  description: JsonLanguage;
}

export interface StatsValue {
  value: number;
  id_extern: string;
  avg_rank: number;
  avg_notation: number;
  notations: Array<number>;
  ranks: Array<number>;
}
