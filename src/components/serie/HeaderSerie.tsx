import {
  Button,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { percent, viewHeight } from "csx";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { style } from "typestyle";
import { VideoDialog } from "../commun/dialog/VideoDialog";

import VideocamIcon from "@mui/icons-material/Videocam";
import { ImageNotFoundBlock } from "../commun/ImageBlock";
import { SerieDetails } from "src/models/tmdb/tv/SerieDetails";
import { Video } from "src/models/tmdb/commun/Video";
import { MediaType } from "src/models/tmdb/enum";
import moment from "moment";
import { HeaderMovieSerieSkeleton } from "../commun/skeleton/HeaderMovieSerieSkeleton";
import { BASEURLMOVIE, THEMETMDB } from "src/routes/movieRoutes";
import { Rank } from "src/models/Rank";
import { getRanksByIdExtern } from "src/api/supabase/rank";
import {
  ItemToCheck,
  ItemToRank,
  RankContext,
} from "src/pages/tmdb/HomeMoviesPage";
import { VoteBadge } from "../commun/VoteBadge";

import StarRateIcon from "@mui/icons-material/StarRate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const posterCss = style({
  width: percent(100),
});

interface Props {
  detail?: SerieDetails;
  videos: Array<Video>;
  isLoading?: boolean;
}

export const HeaderSerie = ({ detail, videos, isLoading }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [open, setOpen] = useState(false);
  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  const trailers = videos.filter((video) => video.type === "Trailer");

  useEffect(() => {
    if (refresh) {
      setIsLoadingRank(true);
      getRank();
      setRefresh(false);
    }
  }, [refresh]);

  const getRank = async () => {
    if (detail) {
      const { data } = await getRanksByIdExtern(
        detail.id,
        THEMETMDB,
        MediaType.tv
      );
      setRank(data as Rank);
      setIsLoadingRank(false);
    }
  };

  useEffect(() => {
    setIsLoadingRank(true);
    getRank();
  }, [detail]);

  const rankSerie = () => {
    if (detail) {
      const item: ItemToRank = {
        id: detail.id,
        name: detail.name,
        description: detail.overview,
        image: `https://image.tmdb.org/t/p/original${detail.backdrop_path}`,
        type: MediaType.tv,
      };
      setItemToRank(item);
    }
  };

  const check = (isSee: boolean) => {
    if (detail) {
      const item: ItemToCheck = {
        id: detail.id,
        name: detail.name,
        description: detail.overview,
        image: `https://image.tmdb.org/t/p/original${detail.backdrop_path}`,
        type: MediaType.tv,
        isSee,
        idRank: rank !== null ? rank.id : undefined,
      };
      setItemToCheck(item);
    }
  };

  const isCheck = rank !== null;

  return (
    <Grid container spacing={2}>
      <Grid item md={3} display={{ xs: "none", md: "block" }}>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{ width: percent(100), height: viewHeight(40) }}
          />
        ) : (
          detail &&
          (detail.poster_path !== null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${detail.poster_path}`}
              className={posterCss}
            />
          ) : (
            <ImageNotFoundBlock style={{ aspectRatio: "2/3" }} />
          ))
        )}
      </Grid>
      <Grid item xs={12} md={9}>
        {isLoading ? (
          <HeaderMovieSerieSkeleton />
        ) : (
          detail && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h1"
                  component="span"
                  sx={{ marginRight: 1 }}
                >
                  {detail.name}
                </Typography>
                <Typography variant="h2" component="span" color="secondary">
                  {`(${moment(detail.first_air_date).format("YYYY")}${
                    detail.in_production
                      ? ")"
                      : ` - ${moment(detail.last_air_date).format("YYYY")})`
                  }`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {detail.genres.map((genre) => (
                    <Grid item key={genre.id}>
                      <Chip
                        label={genre.name}
                        variant={"filled"}
                        onClick={() =>
                          navigate({
                            pathname: `${BASEURLMOVIE}/discover`,
                            search: `?page=1&type=${MediaType.tv}&withgenres=${genre.id}`,
                          })
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
                <Tooltip title={t("commun.rankuser")}>
                  <VoteBadge value={detail.vote_average} />
                </Tooltip>
                {!isLoadingRank && (
                  <>
                    {isCheck ? (
                      <Tooltip title={t("commun.notseeserie")}>
                        <IconButton
                          aria-label="Check"
                          onClick={() => check(false)}
                        >
                          <VisibilityOffIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title={t("commun.seeserie")}>
                        <IconButton
                          aria-label="Check"
                          onClick={() => check(true)}
                        >
                          <VisibilityIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t("commun.rankserie")}>
                      <IconButton aria-label="Rate" onClick={rankSerie}>
                        <StarRateIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {trailers.length > 0 && (
                  <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<VideocamIcon />}
                    onClick={() => setOpen(true)}
                  >
                    <Typography variant="h6">
                      {t("pages.movie.trailer")}
                    </Typography>
                  </Button>
                )}
                <Typography variant="h6">
                  {detail.number_of_seasons} {t("commun.seasons")} -{" "}
                  {detail.number_of_episodes} {t("commun.episodes")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4">{t("pages.movie.summary")}</Typography>
                <Typography variant="body1">{detail.overview}</Typography>
              </Grid>
            </Grid>
          )
        )}
      </Grid>
      {trailers.length > 0 && (
        <VideoDialog
          videos={trailers}
          onClose={() => setOpen(false)}
          open={open}
        />
      )}
    </Grid>
  );
};
