import { Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { Theme } from "src/models/Theme";

interface PropsTitleTheme {
  value: Theme;
}

export const TitleTheme = ({ value }: PropsTitleTheme) => {
  const { language } = useContext(UserContext);

  const nameLocalLanguage = value.name[language.iso];
  const nameEnglish = value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  return <Typography variant="h1">{name}</Typography>;
};
