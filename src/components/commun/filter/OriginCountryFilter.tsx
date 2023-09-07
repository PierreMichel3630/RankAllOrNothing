import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Filter } from "src/models/tmdb/commun/Filter";
import { ChipLanguageOrigin } from "../Chip";
import { LANGUAGESORIGIN, LanguageOrigin } from "src/models/LanguageOrigin";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}
export const OriginCountryFilter = ({ filter, onChange }: Props) => {
  const { t } = useTranslation();

  const languagesSelect = filter.origincountry;

  const selectLanguage = (value: LanguageOrigin) => {
    let newValue: Array<string> = [...languagesSelect];
    if (newValue.includes(value.language)) {
      newValue = newValue.filter((el) => el !== value.language);
    } else {
      newValue.push(value.language);
    }
    let newFilter: Filter = { ...filter, origincountry: newValue };
    onChange(newFilter);
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h2">{t("commun.origincountry")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          {LANGUAGESORIGIN.map((language) => (
            <Grid item key={language.id}>
              <ChipLanguageOrigin
                language={language}
                active={languagesSelect.includes(language.language)}
                onClick={() => selectLanguage(language)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
