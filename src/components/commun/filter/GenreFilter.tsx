import { useContext, useEffect, useState } from "react";

import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Filter } from "src/models/tmdb/commun/Filter";
import { ChipGenre } from "../Chip";
import { Genre } from "src/models/tmdb/commun/Genre";
import { SearchContext } from "src/pages/tmdb/HomeMoviesPage";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
  without?: boolean;
}

export const GenreFilter = ({ filter, onChange, without = false }: Props) => {
  const { t } = useTranslation();

  const { genres } = useContext(SearchContext);

  const genresSelect = without ? filter.withoutgenres : filter.withgenres;

  const selectGenre = (genre: Genre) => {
    let newGenres: Array<number> = [...genresSelect];
    if (newGenres.includes(genre.id)) {
      newGenres = newGenres.filter((el) => el !== genre.id);
    } else {
      newGenres.push(genre.id);
    }
    let newFilter: Filter = without
      ? { ...filter, withoutgenres: newGenres }
      : { ...filter, withgenres: newGenres };
    onChange(newFilter);
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h2">
          {without ? t("commun.withoutgenres") : t("commun.withgenres")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          {genres
            .filter((el) => el.type === filter.type)
            .map((genre) => (
              <Grid item key={genre.id}>
                <ChipGenre
                  genre={genre}
                  active={genresSelect.includes(genre.id)}
                  onClick={() => selectGenre(genre)}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
