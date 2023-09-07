import { Alert, Chip, Container, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "src/App";
import { searchAll } from "src/api/tmdb/commun";
import { CardSearch } from "src/components/commun/CardSearch";
import { useQuery } from "src/utils/hook";
import { useNavigate } from "react-router-dom";
import { FixedBottomPagination } from "src/components/commun/Pagination";
import { MovieSearchElement } from "src/models/tmdb/movie/MovieSearchElement";
import { PersonSearchElement } from "src/models/tmdb/person/PersonSearchElement";
import { TvSearchElement } from "src/models/tmdb/tv/TvSearchElement";
import { useTranslation } from "react-i18next";
import { CardSearchSkeleton } from "src/components/commun/skeleton/Skeleton";
import { MediaType } from "src/models/tmdb/enum";
import { SearchContext } from "./HomeMoviesPage";
import { BASEURLMOVIE } from "src/routes/movieRoutes";

export const SearchPage = () => {
  const params = useQuery();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { language } = useContext(UserContext);
  const { setType } = useContext(SearchContext);
  const query = params.has("query") ? (params.get("query") as string) : "";
  const page = params.has("page") ? Number(params.get("page")) : 1;
  const type = params.has("type")
    ? (params.get("type") as MediaType)
    : undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [isNoResult, setIsNoResult] = useState(false);

  const [results, setResults] = useState<
    Array<MovieSearchElement | PersonSearchElement | TvSearchElement>
  >([]);
  const [totalPage, setTotalPage] = useState<undefined | number>(undefined);
  const [totalResult, setTotalResult] = useState<number>(0);

  const search = () => {
    searchAll(query, language.iso, page, type).then((res) => {
      setTotalPage(res.total_pages);
      setResults(
        type
          ? [...res.results.map((el) => ({ ...el, media_type: type }))]
          : [...res.results]
      );
      setIsLoading(false);
      setIsNoResult(res.total_results === 0);
      setTotalResult(res.total_results);
    });
  };

  const changePage = (value: number) => {
    navigate({
      pathname: `${BASEURLMOVIE}/search`,
      search: `?query=${query}&page=${value}${type ? `&type=${type}` : ""}`,
    });
  };

  const selectFilter = (value?: MediaType) => {
    navigate({
      pathname: `${BASEURLMOVIE}/search`,
      search: `?query=${query}&page=1${value ? `&type=${value}` : ""}`,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    search();
  }, [type, query, language, page]);

  useEffect(() => {
    setType(type);
  }, [type]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        {isNoResult ? (
          <Grid item xs={12}>
            <Alert severity="warning">{t("commun.noresult")}</Alert>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Chip
                    label={t("commun.all")}
                    variant={type === undefined ? "filled" : "outlined"}
                    onClick={() => selectFilter(undefined)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={t("commun.movies")}
                    variant={
                      type && type === MediaType.movie ? "filled" : "outlined"
                    }
                    onClick={() => selectFilter(MediaType.movie)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={t("commun.series")}
                    variant={
                      type && type === MediaType.tv ? "filled" : "outlined"
                    }
                    onClick={() => selectFilter(MediaType.tv)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={t("commun.persons")}
                    variant={
                      type && type === MediaType.person ? "filled" : "outlined"
                    }
                    onClick={() => selectFilter(MediaType.person)}
                  />
                </Grid>
              </Grid>
            </Grid>
            {totalPage !== undefined && (
              <FixedBottomPagination
                page={page}
                totalPage={totalPage}
                onChange={changePage}
                totalResult={totalResult}
              />
            )}
            {isLoading ? (
              Array.from(new Array(20)).map((_, index) => (
                <Grid key={index} item xs={6} sm={4} md={3} lg={3} xl={3}>
                  <CardSearchSkeleton />
                </Grid>
              ))
            ) : (
              <>
                {results.map((el) => (
                  <Grid key={el.id} item xs={6} sm={4} md={3} lg={3} xl={3}>
                    <CardSearch value={el} />
                  </Grid>
                ))}
              </>
            )}
          </>
        )}
      </Grid>
    </Container>
  );
};
