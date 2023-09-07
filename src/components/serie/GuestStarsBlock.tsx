import { Alert, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { sortByPopularity } from "src/utils/sort";
import { CardPersonGuest } from "../commun/Card";
import { useState } from "react";
import { getBreakpoint } from "src/utils/mediaQuery";
import { SeeMoreButton } from "../button/Button";
import { GuestStar } from "src/models/tmdb/commun/GuestStar";
import { CardActorSkeleton } from "../commun/skeleton/Skeleton";
import { normalizeString } from "src/utils/string";
import { BasicSearchInput } from "../commun/Input";

interface Props {
  guests: Array<GuestStar>;
  isLoading?: boolean;
}

export const GuestStarsBlock = ({ guests, isLoading = false }: Props) => {
  const NUMBERLINESHOW = 1;

  const { t } = useTranslation();

  const [seeMore, setSeeMore] = useState(false);
  const [searchActor, setSearchActor] = useState("");
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

  const guestsFilter = guests.filter(
    (guest) =>
      normalizeString(guest.name).includes(normalizeSearch) ||
      normalizeString(guest.original_name).includes(normalizeSearch) ||
      normalizeString(guest.character).includes(normalizeSearch)
  );
  const guestsDisplay = seeMore
    ? guestsFilter.sort(sortByPopularity)
    : guestsFilter.sort(sortByPopularity).slice(0, itemPerLine);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h2" noWrap sx={{ overflow: "inherit" }}>
          {t("commun.gueststars")}
        </Typography>
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
          {guestsDisplay.length > 0 ? (
            guestsDisplay.map((guest) => (
              <Grid key={guest.id} item xs={6} sm={3} md={3} lg={2} xl={2}>
                <CardPersonGuest value={guest} />
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
          {guestsFilter.length > itemPerLine && (
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
