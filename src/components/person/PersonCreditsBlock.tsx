import { Alert, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getBreakpoint } from "src/utils/mediaQuery";
import { useContext, useEffect, useState } from "react";
import { SeeMoreButton } from "../button/Button";
import {
  sortByDateDesc,
  sortByFirstAirDate,
  sortByReleaseYear,
} from "src/utils/sort";
import { PersonCreditsMovie } from "src/models/tmdb/person/PersonCreditsMovie";
import { PersonCreditsTv } from "src/models/tmdb/person/PersonCreditsTv";
import {
  CastPersonCard,
  CastPersonMovieCard,
  CastPersonTvCard,
} from "./CreditPersonCard";
import {
  filterMovieAlreadyOut,
  filterMovieUpcoming,
  filterTvAlreadyOut,
  filterTvUpcoming,
} from "src/utils/filter";
import { MediaType } from "src/models/tmdb/enum";
import { getPersonMovieCredit, getPersonTVCredit } from "src/api/tmdb/person";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "src/App";
import { CardMovieSerieSkeleton } from "../commun/skeleton/Skeleton";
import { normalizeString } from "src/utils/string";
import { BasicSearchInput } from "../commun/Input";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { BASEURLMOVIE } from "src/routes/movieRoutes";

export const PersonCreditsBlock = () => {
  const NUMBERLINESHOW = 2;

  let { id } = useParams();
  const { language } = useContext(UserContext);
  const { t } = useTranslation();

  const [movies, setMovies] = useState<undefined | PersonCreditsMovie>(
    undefined
  );
  const [seeMoreMovie, setSeeMoreMovie] = useState(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [searchMovie, setSearchMovie] = useState("");
  const normalizeSearchMovie = normalizeString(searchMovie);

  const [series, setSeries] = useState<undefined | PersonCreditsTv>(undefined);
  const [seeMoreSerie, setSeeMoreSerie] = useState(false);
  const [isLoadingSerie, setIsLoadingSerie] = useState(true);
  const [searchSerie, setSearchSerie] = useState("");
  const normalizeSearchSerie = normalizeString(searchSerie);

  const breakpoint = getBreakpoint();
  const cols = {
    xs: 6,
    sm: 3,
    md: 3,
    lg: 2,
    xl: 2,
  }[breakpoint];
  const itemShow = (12 / cols) * NUMBERLINESHOW;

  const movieUpcoming = movies ? movies.cast.filter(filterMovieAlreadyOut) : [];
  const serieUpcoming = series ? series.cast.filter(filterTvAlreadyOut) : [];

  const upcoming = [
    ...movieUpcoming.map((el) => ({
      ...el,
      type: MediaType.movie,
      date: el.release_date,
    })),
    ...serieUpcoming.map((el) => ({
      ...el,
      type: MediaType.tv,
      date: el.first_air_date,
    })),
  ]
    .sort(sortByDateDesc)
    .slice(0, 12 / cols);

  const moviesFilter = movies
    ? movies.cast
        .filter(filterMovieUpcoming)
        .filter((movie) =>
          normalizeString(movie.title).includes(normalizeSearchMovie)
        )
    : [];
  const moviesDisplay = seeMoreMovie
    ? moviesFilter.sort(sortByReleaseYear)
    : moviesFilter
        .sort(sortByReleaseYear)
        .slice(0, (12 / cols) * NUMBERLINESHOW);

  const seriesFilter = series
    ? series.cast
        .filter(filterTvUpcoming)
        .filter((serie) =>
          normalizeString(serie.name).includes(normalizeSearchSerie)
        )
    : [];
  const seriesDisplay = seeMoreSerie
    ? seriesFilter.sort(sortByFirstAirDate)
    : seriesFilter
        .sort(sortByFirstAirDate)
        .slice(0, (12 / cols) * NUMBERLINESHOW);

  useEffect(() => {
    if (id) {
      setIsLoadingMovie(true);
      getPersonMovieCredit(Number(id), language.iso).then((res) => {
        setMovies(res);
        setIsLoadingMovie(false);
      });
    }
  }, [id, language]);

  useEffect(() => {
    if (id) {
      setIsLoadingSerie(true);
      getPersonTVCredit(Number(id), language.iso).then((res) => {
        setSeries(res);
        setIsLoadingSerie(false);
      });
    }
  }, [id, language]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h2">{t("commun.movies")}</Typography>
        <BasicSearchInput
          label={t("pages.person.searchmovie")}
          onChange={(value) => setSearchMovie(value)}
          value={searchMovie}
          clear={() => setSearchMovie("")}
        />
        <Tooltip title={t("commun.filter")}>
          <Link
            to={`${BASEURLMOVIE}/discover?page=1&type=${MediaType.movie}&actors=${id}`}
          >
            <IconButton aria-label={t("commun.filter")}>
              <FilterAltIcon />
            </IconButton>
          </Link>
        </Tooltip>
      </Grid>
      {isLoadingMovie ? (
        Array.from(new Array(itemShow)).map((_, index) => (
          <Grid key={index} item xs={6} sm={3} md={3} lg={2} xl={2}>
            <CardMovieSerieSkeleton />
          </Grid>
        ))
      ) : (
        <>
          {moviesDisplay.length > 0 &&
            moviesDisplay.map((cast, index) => (
              <Grid key={index} item xs={6} sm={3} md={3} lg={2} xl={2}>
                <CastPersonMovieCard value={cast} />
              </Grid>
            ))}
          {moviesFilter.length > itemShow && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SeeMoreButton
                seeMore={seeMoreMovie}
                onClick={() => setSeeMoreMovie(!seeMoreMovie)}
              />
            </Grid>
          )}
        </>
      )}
      <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h2">{t("commun.series")}</Typography>
        <BasicSearchInput
          label={t("pages.person.searchserie")}
          onChange={(value) => setSearchSerie(value)}
          value={searchSerie}
          clear={() => setSearchSerie("")}
        />
      </Grid>
      {isLoadingSerie ? (
        Array.from(new Array(itemShow)).map((_, index) => (
          <Grid key={index} item xs={6} sm={3} md={3} lg={2} xl={2}>
            <CardMovieSerieSkeleton />
          </Grid>
        ))
      ) : (
        <>
          {seriesDisplay.length > 0 ? (
            seriesDisplay.map((cast, index) => (
              <Grid key={index} item xs={6} sm={3} md={3} lg={2} xl={2}>
                <CastPersonTvCard value={cast} />
              </Grid>
            ))
          ) : searchSerie !== "" ? (
            <Grid item xs={12}>
              <Alert severity="warning">{t("commun.noresult")}</Alert>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">{t("commun.noresultserie")}</Alert>
            </Grid>
          )}

          {seriesFilter.length > itemShow && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SeeMoreButton
                seeMore={seeMoreSerie}
                onClick={() => setSeeMoreSerie(!seeMoreSerie)}
              />
            </Grid>
          )}
        </>
      )}
      {upcoming.length > 0 && (
        <>
          <Grid item xs={12}>
            <Typography variant="h2">{t("commun.upcoming")}</Typography>
          </Grid>
          {upcoming.map((cast) => (
            <Grid key={cast.id} item xs={6} sm={3} md={3} lg={2} xl={2}>
              <CastPersonCard value={cast} type={cast.type} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};
