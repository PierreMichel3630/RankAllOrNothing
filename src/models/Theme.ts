import { JsonLanguage } from "./Language";

export interface Theme {
  id: number;
  image: string;
  name: JsonLanguage;
  description: JsonLanguage;
}

export interface ThemeInsert {
  image: string;
  name: JsonLanguage;
  description: JsonLanguage;
}
