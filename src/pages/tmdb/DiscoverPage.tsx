import {
  Alert,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { UserContext } from "src/App";
import { CardSearch } from "src/components/commun/CardSearch";
import { useQuery } from "src/utils/hook";
import { FixedBottomPagination } from "src/components/commun/Pagination";
import { MediaType, SortImdb } from "src/models/tmdb/enum";
import { MovieSearchElement } from "src/models/tmdb/movie/MovieSearchElement";
import { PersonSearchElement } from "src/models/tmdb/person/PersonSearchElement";
import { TvSearchElement } from "src/models/tmdb/tv/TvSearchElement";
import { CardSearchSkeleton } from "src/components/commun/skeleton/Skeleton";
import { FilterDialog } from "src/components/commun/dialog/FilterDialog";
import { Filter } from "src/models/tmdb/commun/Filter";
import { FilterChip } from "src/components/commun/FilterChip";
import { dicoverAll } from "src/api/tmdb/commun";
import { SortMenu } from "src/components/commun/sort/SortMenu";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { BASEURLMOVIE } from "src/routes/movieRoutes";

export const DiscoverPage = () => {
  const params = useQuery();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  // PARAMS FILTER
  const sort = params.has("sort")
    ? (params.get("sort") as SortImdb)
    : SortImdb.popularityDesc;
  const page = params.has("page") ? Number(params.get("page")) : 1;
  const type = params.has("type")
    ? (params.get("type") as MediaType)
    : MediaType.movie;
  const runtimeOver = params.has("runtimeover")
    ? Number(params.get("runtimeover"))
    : undefined;
  const runtimeUnder = params.has("runtimeunder")
    ? Number(params.get("runtimeunder"))
    : undefined;
  const voteOver = params.has("voteover")
    ? Number(params.get("voteover"))
    : undefined;
  const voteUnder = params.has("voteunder")
    ? Number(params.get("voteunder"))
    : undefined;
  const yearAfter = params.has("yearafter")
    ? Number(params.get("yearafter"))
    : undefined;
  const yearBefore = params.has("yearbefore")
    ? Number(params.get("yearbefore"))
    : undefined;
  const yearsExactParams = params.get("yearsexact");
  const yearsExactSelect =
    params.has("yearsexact") && yearsExactParams !== null
      ? yearsExactParams.split(",").map((el) => Number(el))
      : [];

  const withGenresParams = params.get("withgenres");
  const withGenresSelect =
    params.has("withgenres") && withGenresParams !== null
      ? withGenresParams.split(",").map((el) => Number(el))
      : [];

  const withoutGenresParams = params.get("withoutgenres");
  const withoutGenresSelect =
    params.has("withoutgenres") && withoutGenresParams !== null
      ? withoutGenresParams.split(",").map((el) => Number(el))
      : [];

  const actorsParams = params.get("actors");
  const actorsSelect =
    params.has("actors") && actorsParams !== null
      ? actorsParams.split(",").map((el) => Number(el))
      : [];

  const originCountryParams = params.get("origincountry");
  const originCountrySelect =
    params.has("origincountry") && originCountryParams !== null
      ? originCountryParams.split(",")
      : [];

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<
    Array<MovieSearchElement | PersonSearchElement | TvSearchElement>
  >([]);
  const [totalPage, setTotalPage] = useState<undefined | number>(undefined);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [isNoResult, setIsNoResult] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState<Filter>({
    withgenres: withGenresSelect,
    withoutgenres: withoutGenresSelect,
    actors: actorsSelect,
    origincountry: originCountrySelect,
    runtime: {
      over: runtimeOver,
      under: runtimeUnder,
    },
    vote: {
      over: voteOver,
      under: voteUnder,
    },
    year: {
      after: yearAfter,
      before: yearBefore,
      exact: yearsExactSelect,
    },
    page: page,
    type: type,
    sort: sort,
  });

  const search = () => {
    dicoverAll(page, language.iso, filter).then((res) => {
      setTotalPage(res.total_pages);
      setResults([
        ...res.results.map((el) => ({
          ...el,
          media_type: filter.type,
        })),
      ]);
      setIsLoading(false);
      setIsNoResult(res.total_results === 0);
      setTotalResult(res.total_results);
    });
  };

  const changePage = (value: number) => {
    navigate({
      pathname: `${BASEURLMOVIE}/discover`,
      search: `?page=${value}&type=${type}${
        withGenresSelect.length > 0
          ? `&withgenres=${withGenresSelect.join(",")}`
          : ""
      }`,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    search();
  }, [filter, type, language, page]);

  const submitFilter = (value: Filter) => {
    setOpenFilter(false);
    let urlSearch = `?page=${value.page}&type=${value.type}`;
    if (value.withgenres.length > 0) {
      urlSearch = urlSearch + `&withgenres=${value.withgenres.join(",")}`;
    }
    if (value.withoutgenres.length > 0) {
      urlSearch = urlSearch + `&withoutgenres=${value.withoutgenres.join(",")}`;
    }
    if (value.actors.length > 0) {
      urlSearch = urlSearch + `&actors=${value.actors.join(",")}`;
    }
    if (value.origincountry.length > 0) {
      urlSearch = urlSearch + `&origincountry=${value.origincountry.join(",")}`;
    }
    if (value.runtime.over) {
      urlSearch = urlSearch + `&runtimeover=${value.runtime.over}`;
    }
    if (value.runtime.under) {
      urlSearch = urlSearch + `&runtimeunder=${value.runtime.under}`;
    }
    if (value.vote.over) {
      urlSearch = urlSearch + `&voteover=${value.vote.over}`;
    }
    if (value.vote.under) {
      urlSearch = urlSearch + `&voteunder=${value.vote.under}`;
    }
    if (value.year.before) {
      urlSearch = urlSearch + `&yearbefore=${value.year.before}`;
    }
    if (value.year.after) {
      urlSearch = urlSearch + `&yearafter=${value.year.after}`;
    }
    if (value.year.exact.length > 0) {
      urlSearch = urlSearch + `&yearsexact=${value.year.exact.join(",")}`;
    }
    if (value.sort) {
      urlSearch = urlSearch + `&sort=${value.sort}`;
    }
    navigate({
      pathname: `${BASEURLMOVIE}/discover`,
      search: urlSearch,
    });
    setFilter(value);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", gap: 2, alignItems: "center" }}
        >
          <Typography variant="h1">{t("pages.discover.title")}</Typography>
          <Tooltip title={t("commun.filter")}>
            <IconButton
              aria-label={t("commun.filter")}
              onClick={() => setOpenFilter(true)}
            >
              <FilterAltIcon />
            </IconButton>
          </Tooltip>
          <SortMenu filter={filter} onSubmit={submitFilter} />
        </Grid>
        <Grid item xs={12}>
          <FilterChip
            filter={filter}
            onChange={submitFilter}
            openFilter={() => setOpenFilter(true)}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {isNoResult ? (
              <Grid item xs={12}>
                <Alert severity="warning">{t("commun.noresult")}</Alert>
              </Grid>
            ) : (
              <>
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
        </Grid>
      </Grid>
      <FilterDialog
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onSubmit={submitFilter}
        filter={filter}
      />
    </Container>
  );
};
