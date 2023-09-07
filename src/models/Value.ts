import { Language } from "./Language";
import { Theme } from "./Theme";

export interface ValueView {
  id: number;
  image: string;
  trads: Array<{
    id: number;
    name: string;
    description: string;
    iso: string;
  }>;
  theme: number;
  languages: Array<number>;
}

export interface Value {
  id: number;
  image: string;
  theme: Theme;
}

export interface ValueInsert {
  image: string;
  theme: number;
}

export interface TranslateValue {
  id: number;
  value: Value;
  language: Language;
  name: string;
  description: string;
}

export interface TranslateValueInsert {
  value: number;
  language: number;
  name: string;
  description: string;
}
