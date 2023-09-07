import { Language } from "./Language";

export interface ThemeView {
  id: number;
  extern: boolean;
  image: string;
  trads: Array<{
    id: number;
    name: string;
    description: string;
    iso: string;
  }>;
  languages: Array<number>;
}

export interface Theme {
  id: number;
  image: string;
}

export interface ThemeInsert {
  image: string;
}

export interface TranslateTheme {
  id?: number;
  theme: Theme;
  language: Language;
  name: string;
  description: string;
}

export interface TranslateThemeEnglish extends TranslateTheme {
  isEnglish: boolean;
}

export interface TranslateThemeInsert {
  theme: number;
  language: number;
  name: string;
  description: string;
}
