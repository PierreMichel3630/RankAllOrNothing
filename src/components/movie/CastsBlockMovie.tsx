import { Alert, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CardPerson } from "../commun/Card";
import { useContext, useEffect, useState } from "react";
import { getBreakpoint } from "src/utils/mediaQuery";
import { SeeMoreButton } from "../button/Button";
import { Cast } from "src/models/tmdb/commun/Cast";
import { getMovieCredit } from "src/api/tmdb/movie";
import { UserContext } from "src/App";
import { useParams } from "react-router-dom";
import { CardActorSkeleton } from "../commun/skeleton/Skeleton";
import { normalizeString } from "src/utils/string";
import { BasicSearchInput } from "../commun/Input";

export const CastsBlockMovie = () => {
  const NUMBERLINESHOW = 1;

  const { t } = useTranslation();
  let { id } = useParams();
  const { language } = useContext(UserContext);

  const [seeMore, setSeeMore] = useState(false);
  const [casts, setCasts] = useState<Array<Cast>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const normalizeSearch = normalizeString(search);

  const breakpoint = getBreakpoint();
  const cols = {
    xs: 6,
    sm: 3,
    md: 3,
    lg: 2,
    xl: 2,
  }[breakpoint];
  const itemPerLine = (12 / cols) * NUMBERLINESHOW;

  const castsFilter = casts.filter(
    (cast) =>
      normalizeString(cast.name).includes(normalizeSearch) ||
      normalizeString(cast.original_name).includes(normalizeSearch) ||
      normalizeString(cast.character).includes(normalizeSearch)
  );

  const castsDisplay = seeMore
    ? castsFilter
    : castsFilter.slice(0, itemPerLine);

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      getMovieCredit(Number(id), language.iso).then((res) => {
        setCasts(res.cast);
        setIsLoading(false);
      });
    }
  }, [id, language]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h2">{t("commun.cast")}</Typography>
        <BasicSearchInput
          label={t("pages.serie.searchactor")}
          onChange={(value) => setSearch(value)}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>

      {isLoading ? (
        Array.from(new Array(itemPerLine)).map((_, index) => (
          <Grid key={index} item xs={6} sm={3} md={3} lg={2} xl={2}>
            <CardActorSkeleton />
          </Grid>
        ))
      ) : (
        <>
          {castsDisplay.length > 0 ? (
            castsDisplay.map((cast) => (
              <Grid item key={cast.id} xs={6} sm={3} md={3} lg={2} xl={2}>
                <CardPerson value={cast} />
              </Grid>
            ))
          ) : search !== "" ? (
            <Grid item xs={12}>
              <Alert severity="warning">{t("commun.noresult")}</Alert>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">{t("commun.noresultactor")}</Alert>
            </Grid>
          )}
          {castsFilter.length > itemPerLine && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SeeMoreButton
                seeMore={seeMore}
                onClick={() => setSeeMore(!seeMore)}
              />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};
