export interface Language {
  id: number;
  iso: string;
  name: string;
  abbreviation: string;
  image: string;
}

export interface JsonLanguage {
  [iso: string]: string;
}
