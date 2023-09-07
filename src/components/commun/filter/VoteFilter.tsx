import { Box, Grid, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "src/models/tmdb/commun/Filter";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}
export const VoteFilter = ({ filter, onChange }: Props) => {
  const { t } = useTranslation();

  const MIN = 0;
  const MAX = 10;
  const STEP = 0.5;
  const [value, setValue] = useState<number[]>([
    filter.vote.over ? filter.vote.over : MIN,
    filter.vote.under ? filter.vote.under : MAX,
  ]);
  const marks = [MIN, 5, MAX];

  const handleChange = (event: Event, value: number | number[]) => {
    const newValue = value as number[];
    const over = newValue[0];
    const under = newValue[1];
    setValue(newValue);

    let newFilter: Filter = {
      ...filter,
      vote: {
        ...filter.vote,
        under: under !== MAX ? under : undefined,
        over: over !== MIN ? over : undefined,
      },
    };
    onChange(newFilter);
  };

  const valuetext = (value: number) => `${value}`;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={2}>
        <Typography variant="h2">{t("commun.vote")}</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Box sx={{ marginTop: 4, marginRight: 4, marginLeft: 4 }}>
          <Slider
            getAriaLabel={() => "Vote range"}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="on"
            valueLabelFormat={valuetext}
            getAriaValueText={valuetext}
            min={MIN}
            max={MAX}
            marks={marks.map((el) => ({
              label: valuetext(el),
              value: el,
            }))}
            step={STEP}
            color="secondary"
          />
        </Box>
      </Grid>
    </Grid>
  );
};
