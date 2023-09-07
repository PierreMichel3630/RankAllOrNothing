import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Filter } from "src/models/tmdb/commun/Filter";
import { ChipMediaType } from "../Chip";
import { MediaType } from "src/models/tmdb/enum";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export const MediaTypeFilter = ({ filter, onChange }: Props) => {
  const { t } = useTranslation();

  const selectType = (value: MediaType) => {
    let newFilter: Filter = { ...filter, type: value };
    onChange(newFilter);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={3}>
        <Typography variant="h2">{t("commun.type")}</Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Grid container spacing={1}>
          <Grid item>
            <ChipMediaType
              type={MediaType.movie}
              active={filter.type === MediaType.movie}
              onClick={() => selectType(MediaType.movie)}
            />
          </Grid>
          <Grid item>
            <ChipMediaType
              type={MediaType.tv}
              active={filter.type === MediaType.tv}
              onClick={() => selectType(MediaType.tv)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
