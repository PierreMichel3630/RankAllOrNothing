import { Alert, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { sortByTotalEpisodeCount } from "src/utils/sort";
import { CardPersonTv } from "../commun/Card";
import { useContext, useEffect, useState } from "react";
import { getBreakpoint } from "src/utils/mediaQuery";
import { SeeMoreButton } from "../button/Button";
import { TvAggregateCreditCast } from "src/models/tmdb/tv/TvAggregateCreditCast";
import { BasicSearchInput } from "../commun/Input";
import { normalizeString } from "src/utils/string";
import { CardActorSkeleton } from "../commun/skeleton/Skeleton";
import { getTvCredit } from "src/api/tmdb/tv";
import { useParams } from "react-router-dom";
import { UserContext } from "src/App";

export const CastsSerieBlock = () => {
  const NUMBERLINESHOW = 1;

  const { t } = useTranslation();
  let { id } = useParams();
  const { language } = useContext(UserContext);

  const [seeMore, setSeeMore] = useState(false);
  const [searchActor, setSearchActor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [casts, setCasts] = useState<Array<TvAggregateCreditCast>>([]);

  const normalizeSearch = normalizeString(searchActor);

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
      cast.roles.some((role) =>
        normalizeString(role.character).includes(normalizeSearch)
      )
  );

  const castsDisplay = seeMore
    ? castsFilter.sort(sortByTotalEpisodeCount)
    : castsFilter.sort(sortByTotalEpisodeCount).slice(0, itemPerLine);

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      getTvCredit(Number(id), language.iso).then((res) => {
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
          onChange={(value) => setSearchActor(value)}
          value={searchActor}
          clear={() => setSearchActor("")}
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
            castsDisplay.map((cast, index) => (
              <Grid item key={index} xs={6} sm={3} md={3} lg={2} xl={2}>
                <CardPersonTv value={cast} />
              </Grid>
            ))
          ) : searchActor !== "" ? (
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
