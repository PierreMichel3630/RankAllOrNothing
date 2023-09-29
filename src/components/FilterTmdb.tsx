import { Chip, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MediaType } from "src/models/tmdb/enum";

interface Props {
  select: (value: MediaType) => void;
  value: MediaType;
}

export const FilterTmdb = ({ select, value }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item>
        <Chip
          label={t("commun.movies")}
          variant={value === MediaType.movie ? "filled" : "outlined"}
          onClick={() => select(MediaType.movie)}
        />
      </Grid>
      <Grid item>
        <Chip
          label={t("commun.series")}
          variant={value === MediaType.tv ? "filled" : "outlined"}
          onClick={() => select(MediaType.tv)}
        />
      </Grid>
      <Grid item>
        <Chip
          label={t("commun.persons")}
          variant={value === MediaType.person ? "filled" : "outlined"}
          onClick={() => select(MediaType.person)}
        />
      </Grid>
    </Grid>
  );
};
