import { Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { ThemeView } from "src/models/Theme";

interface PropsTitleTheme {
  value: ThemeView;
}

export const TitleTheme = ({ value }: PropsTitleTheme) => {
  const { language } = useContext(UserContext);

  const tradLocalLanguage = value.trads.find((el) => el.iso === language.iso);
  const tradEnglish = value.trads.find((el) => el.iso === DEFAULT_ISO_LANGUAGE);

  const trad = tradLocalLanguage ? tradLocalLanguage : tradEnglish;

  return <Typography variant="h1">{trad ? trad.name : "---"}</Typography>;
};
