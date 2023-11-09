import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";
import { style } from "typestyle";
import { ImageNotFoundBlock } from "../commun/ImageBlock";
import { PersonDetails } from "src/models/tmdb/person/PersonDetails";
import moment from "moment";
import { ExternalIdBlock } from "../commun/ExternalIdBlock";
import { useContext, useEffect, useState } from "react";
import { getPersonExternalId } from "src/api/tmdb/person";
import { Link, useParams } from "react-router-dom";
import { HeaderPersonSkeleton } from "../commun/skeleton/HeaderPersonSkeleton";
import { openInNewTab } from "src/utils/navigation";

import { Rank } from "src/models/Rank";
import { BASEURLMOVIE, THEMETMDB } from "src/routes/movieRoutes";
import { getRanksByIdExtern } from "src/api/supabase/rank";
import { MediaType } from "src/models/tmdb/enum";
import {
  ItemToCheck,
  ItemToRank,
  RankContext,
} from "src/pages/tmdb/HomeMoviesPage";

import LinkIcon from "@mui/icons-material/Link";
import StarRateIcon from "@mui/icons-material/StarRate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "src/context/AuthProviderSupabase";
import { VoteBadge } from "../commun/VoteBadge";
import BarChartIcon from "@mui/icons-material/BarChart";

const posterCss = style({
  width: percent(100),
});

interface Props {
  detail?: PersonDetails;
  isLoading?: boolean;
}

export const HeaderPerson = ({ detail, isLoading = false }: Props) => {
  let { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [externalId, setExternalId] = useState<undefined | ExternalId>(
    undefined
  );
  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  useEffect(() => {
    if (refresh) {
      setIsLoadingRank(true);
      getRank();
      setRefresh(false);
    }
  }, [refresh]);

  const getRank = async () => {
    if (detail && user) {
      const { data } = await getRanksByIdExtern(
        user.id,
        detail.id,
        THEMETMDB,
        MediaType.person
      );
      setRank(data as Rank);
      setIsLoadingRank(false);
    }
  };

  useEffect(() => {
    setIsLoadingRank(true);
    getRank();
  }, [detail, user]);

  useEffect(() => {
    if (id) {
      getPersonExternalId(Number(id)).then((res) => {
        setExternalId(res);
      });
    }
  }, [id]);

  const rankPerson = () => {
    if (detail) {
      const item: ItemToRank = {
        id: detail.id,
        name: detail.name,
        description: detail.biography,
        image: `https://image.tmdb.org/t/p/original${detail.profile_path}`,
        type: MediaType.person,
      };
      setItemToRank(item);
    }
  };

  const checkPerson = (isSee: boolean) => {
    if (detail) {
      const item: ItemToCheck = {
        id: detail.id,
        name: detail.name,
        description: detail.biography,
        image: `https://image.tmdb.org/t/p/original${detail.profile_path}`,
        type: MediaType.person,
        isSee,
        idRank: rank !== null ? rank.id : undefined,
      };
      setItemToCheck(item);
    }
  };

  const isCheck = rank !== null;

  return isLoading ? (
    <HeaderPersonSkeleton />
  ) : (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        {detail &&
          (detail.profile_path !== null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${detail.profile_path}`}
              className={posterCss}
            />
          ) : (
            <ImageNotFoundBlock style={{ aspectRatio: "2/3" }} />
          ))}
      </Grid>
      {detail && (
        <>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md="auto" sx={{ display: "flex", gap: 1 }}>
                <Typography variant="h1">{detail.name}</Typography>
                {detail.homepage !== null && detail.homepage !== "" && (
                  <IconButton
                    aria-label="homepage"
                    size="medium"
                    onClick={() => openInNewTab(detail.homepage as string)}
                  >
                    <LinkIcon fontSize="medium" />
                  </IconButton>
                )}
              </Grid>
              <Grid item xs={12} md="auto">
                {externalId && <ExternalIdBlock externalId={externalId} />}
              </Grid>

              {detail.birthday !== null && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{ marginRight: 2 }}
                  >
                    {t("commun.birthday")}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {moment(detail.birthday).format("DD MMMM YYYY")}{" "}
                    {detail.deathday === null &&
                      `(${moment().diff(detail.birthday, "years", false)} ${t(
                        "commun.years"
                      )})`}
                  </Typography>
                </Grid>
              )}
              {detail.deathday !== null && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{ marginRight: 2 }}
                  >
                    {t("commun.deathday")}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {`${moment(detail.deathday).format(
                      "DD MMMM YYYY"
                    )} (${moment(detail.deathday).diff(
                      detail.birthday,
                      "years",
                      false
                    )} ${t("commun.years")})`}
                  </Typography>
                </Grid>
              )}
              {detail.place_of_birth !== null && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{ marginRight: 2 }}
                  >
                    {t("commun.placeofbirth")}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {detail.place_of_birth}
                  </Typography>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                {!isLoadingRank && (
                  <>
                    {rank && rank.notation && (
                      <Tooltip title={t("commun.rankuser")}>
                        <>
                          <VoteBadge value={rank.notation} />
                        </>
                      </Tooltip>
                    )}
                    {isCheck ? (
                      <Tooltip title={t("commun.notseeactor")}>
                        <IconButton
                          aria-label="Check"
                          onClick={() => checkPerson(false)}
                        >
                          <VisibilityOffIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title={t("commun.seeactor")}>
                        <IconButton
                          aria-label="Check"
                          onClick={() => checkPerson(true)}
                        >
                          <VisibilityIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t("commun.rankactor")}>
                      <IconButton aria-label="Rate" onClick={rankPerson}>
                        <StarRateIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>

                    <Link
                      to={`/external/theme/${THEMETMDB}/person/value/${detail.id}/statistic`}
                    >
                      <Tooltip title={t("commun.statistic")}>
                        <IconButton aria-label="Statistic">
                          <BarChartIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </>
                )}
              </Grid>
              {detail.biography !== "" && (
                <Grid
                  item
                  md={12}
                  display={{ xs: "none", sm: "none", md: "block" }}
                >
                  <Typography variant="h4">
                    {t("pages.person.biography")}
                  </Typography>
                  <Typography variant="body1">{detail.biography}</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          {detail.biography !== "" && (
            <Grid
              item
              xs={12}
              sm={12}
              display={{ xs: "block", sm: "block", md: "none" }}
            >
              <Typography variant="h4">
                {t("pages.person.biography")}
              </Typography>
              <Typography variant="body1">{detail.biography}</Typography>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};
