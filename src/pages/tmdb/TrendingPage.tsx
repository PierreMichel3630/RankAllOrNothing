import { Chip, Container, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "src/App";
import { getMovieTrending } from "src/api/tmdb/movie";
import { getTvTrending } from "src/api/tmdb/tv";
import { CardSearch } from "src/components/commun/CardSearch";
import { useTranslation } from "react-i18next";
import { getBreakpoint } from "src/utils/mediaQuery";
import { useNavigate } from "react-router-dom";
import { style } from "typestyle";
import { MovieSearchElement } from "src/models/tmdb/movie/MovieSearchElement";
import { TvSearchElement } from "src/models/tmdb/tv/TvSearchElement";
import { MediaType, TimeTrending } from "src/models/tmdb/enum";
import { CardSearchSkeleton } from "src/components/commun/skeleton/Skeleton";
import { BASEURLMOVIE } from "src/routes/movieRoutes";

const titleCss = style({
  cursor: "pointer",
});

const divFilterCss = style({ marginLeft: 15, display: "flex", gap: 10 });

export const TrendingPage = () => {
  const NUMBERLINESHOW = 1;
  const PAGE = 1;
  const navigate = useNavigate();
  const { language } = useContext(UserContext);
  const { t } = useTranslation();

  const [movies, setMovies] = useState<Array<MovieSearchElement>>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [series, setSeries] = useState<Array<TvSearchElement>>([]);
  const [isLoadingSeries, setIsLoadingSeries] = useState(true);
  const [timeTrendingMovie, setTimeTrendingMovie] = useState<TimeTrending>(
    TimeTrending.day
  );
  const [timeTrendingSerie, setTimeTrendingSerie] = useState<TimeTrending>(
    TimeTrending.day
  );

  useEffect(() => {
    setIsLoadingMovies(true);
    getMovieTrending(PAGE, language.iso, timeTrendingMovie).then((res) => {
      setMovies(res.results as Array<MovieSearchElement>);
      setIsLoadingMovies(false);
    });
  }, [timeTrendingMovie, language]);

  useEffect(() => {
    setIsLoadingSeries(true);
    getTvTrending(PAGE, language.iso, timeTrendingSerie).then((res) => {
      setSeries(res.results as Array<TvSearchElement>);
      setIsLoadingSeries(false);
    });
  }, [timeTrendingSerie, language]);

  const breakpoint = getBreakpoint();
  const cols = {
    xs: 6,
    sm: 4,
    md: 3,
    lg: 3,
    xl: 3,
  }[breakpoint];
  const numberCols = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 15,
  }[breakpoint];
  const itemPerLine = numberCols / cols;
  const nbItemToShow = itemPerLine * NUMBERLINESHOW;

  const moviesDisplay = movies.slice(0, nbItemToShow);

  const seriesDisplay = series.slice(0, nbItemToShow);

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={1}
        columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 15 }}
      >
        <Grid
          item
          xs={12}
          xl={15}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            variant="h2"
            className={titleCss}
            onClick={() =>
              navigate({
                pathname: `${BASEURLMOVIE}/trendingsearch`,
                search: `?page=1&type=${MediaType.movie}`,
              })
            }
          >
            {t("commun.trendingmovie")}
          </Typography>
          <div className={divFilterCss}>
            <Chip
              label={t("commun.today")}
              variant={
                timeTrendingMovie === TimeTrending.day ? "filled" : "outlined"
              }
              onClick={() => setTimeTrendingMovie(TimeTrending.day)}
            />
            <Chip
              label={t("commun.week")}
              variant={
                timeTrendingMovie === TimeTrending.week ? "filled" : "outlined"
              }
              onClick={() => setTimeTrendingMovie(TimeTrending.week)}
            />
          </div>
        </Grid>
        {isLoadingMovies
          ? Array.from(new Array(nbItemToShow)).map((_, index) => (
              <Grid key={index} item xs={6} sm={4} md={3} lg={3} xl={3}>
                <CardSearchSkeleton />
              </Grid>
            ))
          : moviesDisplay.map((el) => (
              <Grid item key={el.id} xs={6} sm={4} md={3} lg={3} xl={3}>
                <CardSearch value={el} />
              </Grid>
            ))}
        <Grid
          item
          xs={12}
          xl={15}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            variant="h2"
            className={titleCss}
            onClick={() =>
              navigate({
                pathname: `${BASEURLMOVIE}/trendingsearch`,
                search: `?page=1&type=${MediaType.tv}`,
              })
            }
          >
            {t("commun.trendingserie")}
          </Typography>
          <div className={divFilterCss}>
            <Chip
              label={t("commun.today")}
              variant={
                timeTrendingSerie === TimeTrending.day ? "filled" : "outlined"
              }
              onClick={() => setTimeTrendingSerie(TimeTrending.day)}
            />
            <Chip
              label={t("commun.week")}
              variant={
                timeTrendingSerie === TimeTrending.week ? "filled" : "outlined"
              }
              onClick={() => setTimeTrendingSerie(TimeTrending.week)}
            />
          </div>
        </Grid>

        {isLoadingSeries
          ? Array.from(new Array(nbItemToShow)).map((_, index) => (
              <Grid key={index} item xs={6} sm={4} md={3} lg={3} xl={3}>
                <CardSearchSkeleton />
              </Grid>
            ))
          : seriesDisplay.map((el) => (
              <Grid item key={el.id} xs={6} sm={4} md={3} lg={3} xl={3}>
                <CardSearch value={el} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};
