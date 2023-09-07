import {
  CN,
  CZ,
  DE,
  ES,
  FR,
  GB,
  IN,
  IT,
  JP,
  KR,
  PT,
  RU,
  SE,
  TR,
} from "country-flag-icons/react/1x1";

export interface LanguageOrigin {
  id: string;
  name: string;
  flag: JSX.Element;
  language: string;
}

export const LANGUAGESORIGIN: Array<LanguageOrigin> = [
  {
    id: "en-GB",
    name: "English",
    flag: <GB title="English UK" />,
    language: "en",
  },
  {
    id: "fr-FR",
    name: "Français",
    flag: <FR title="France" />,
    language: "fr",
  },
  {
    id: "es-ES",
    name: "Español",
    flag: <ES title="Español" />,
    language: "es",
  },
  {
    id: "de-DE",
    name: "Deutsch",
    flag: <DE title="Deutsch" />,
    language: "de",
  },
  {
    id: "ja-JP",
    name: "Japanese",
    flag: <JP title="Japanese" />,
    language: "jp",
  },
  {
    id: "pt-PT",
    name: "Portuguese",
    flag: <PT title="Portuguese " />,
    language: "pt",
  },
  {
    id: "zh-CN",
    name: "Chinese",
    flag: <CN title="Chinese " />,
    language: "zh",
  },
  {
    id: "it-IT",
    name: "Italian",
    flag: <IT title="Italian " />,
    language: "it",
  },
  {
    id: "ru-RU",
    name: "Russian",
    flag: <RU title="Russian" />,
    language: "ru",
  },
  {
    id: "ko-KR",
    name: "Korean",
    flag: <KR title="Korean" />,
    language: "ko",
  },
  {
    id: "hi-IN",
    name: "India",
    flag: <IN title="India" />,
    language: "hi",
  },
  {
    id: "sv-SE",
    name: "Swedish",
    flag: <SE title="Swedish" />,
    language: "sv",
  },
  {
    id: "cs-CZ",
    name: "Czech",
    flag: <CZ title="Czech" />,
    language: "cs",
  },
  {
    id: "tr-TR",
    name: "Turkish",
    flag: <TR title="Turkish" />,
    language: "tr",
  },
];
