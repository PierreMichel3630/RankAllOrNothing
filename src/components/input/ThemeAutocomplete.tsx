import { Autocomplete, TextField } from "@mui/material";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { Language } from "src/models/Language";
import { ThemeView } from "src/models/Theme";

interface Option {
  id: number;
  name: string;
}

interface Props {
  themes: Array<ThemeView>;
  language: Language;
  theme: ThemeView | undefined;
  onChange: (value: ThemeView) => void;
}
export const ThemeAutocomplete = ({
  theme,
  themes,
  language,
  onChange,
}: Props) => {
  const options = themes.map((theme) => {
    const tradLocalLanguage = theme.trads.find((el) => el.iso === language.iso);

    const tradEnglish = theme.trads.find(
      (el) => el.iso === DEFAULT_ISO_LANGUAGE
    );
    const firstTrad = theme.trads[0];

    const trad = tradLocalLanguage
      ? tradLocalLanguage
      : tradEnglish
      ? tradEnglish
      : firstTrad;
    return { id: theme.id, name: trad.name };
  });

  const value = theme ? options.find((el) => el.id === theme.id) : options[0];

  return (
    <Autocomplete
      id="theme-autocomplete"
      value={value}
      options={options}
      onChange={(event: any, newValue: Option) => {
        const newTheme = themes.find((el) => el.id === newValue.id);
        onChange(newTheme ? newTheme : themes[0]);
      }}
      getOptionLabel={(option) => option.name}
      fullWidth
      disableClearable
      renderInput={(params) => <TextField {...params} label="Thème" />}
    />
  );
};
