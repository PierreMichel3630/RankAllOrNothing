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
