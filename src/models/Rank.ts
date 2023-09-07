import { Value } from "./Value";

export interface Rank {
  id: number;
  rank: number;
  notation: number;
  value: Value;
  opinion: string;
  type: string | null;
}

export interface RankDetail {
  id: number;
  rank: number;
  notation: number;
  opinion: string;
  idvalue: number;
  image: string;
  name: string;
  description: string;
  language: number;
  type: string | null;
  id_extern: string | null;
  theme: number;
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
