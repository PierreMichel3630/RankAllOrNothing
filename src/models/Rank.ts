import { Value } from "./Value";

export interface Rank {
  id: number;
  rank: number;
  notation: number;
  value: Value;
  opinion: string;
  type: string | null;
  theme: number;
  id_extern: string | null;
}

export interface RankUpdate {
  id: number;
  rank?: number;
  notation?: number;
  value?: number;
  opinion?: string;
  id_extern?: string;
  type?: string;
  theme?: number;
}

export interface RankInsert {
  rank: number;
  notation: number;
  value?: number;
  opinion: string;
  id_extern?: string;
  type?: string;
  theme?: number;
}

export interface CheckInsert {
  value?: number;
  id_extern?: string;
  type?: string;
  theme?: number;
  rank: number;
}

export interface RankCompare {
  value: Value;
  rankUser1?: Rank;
  rankUser2?: Rank;
  diff: number | null;
}

export interface RankCompareExtern {
  id: string;
  type: string;
  rankUser1?: Rank;
  rankUser2?: Rank;
  diff: number | null;
}
