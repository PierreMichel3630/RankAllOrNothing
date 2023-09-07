import { useContext, useEffect, useState } from "react";

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
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { style } from "typestyle";

import VideocamIcon from "@mui/icons-material/Videocam";
import { VideoDialog } from "../commun/dialog/VideoDialog";
import { ImageNotFoundBlock } from "../commun/ImageBlock";
import { MovieDetails } from "src/models/tmdb/movie/MovieDetails";
import { Video } from "src/models/tmdb/commun/Video";
import { MediaType } from "src/models/tmdb/enum";
import moment from "moment";
import { HeaderMovieSerieSkeleton } from "../commun/skeleton/HeaderMovieSerieSkeleton";
import { openInNewTab } from "src/utils/navigation";
import { FormatTime, toHoursAndMinutes } from "src/utils/time";

import LinkIcon from "@mui/icons-material/Link";
import { BASEURLMOVIE, THEMETMDB } from "src/routes/movieRoutes";

import StarRateIcon from "@mui/icons-material/StarRate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { VoteBadge } from "../commun/VoteBadge";
import {
  ItemToCheck,
  ItemToRank,
  RankContext,
} from "src/pages/tmdb/HomeMoviesPage";
import { Rank } from "src/models/Rank";
import { getRanksByIdExtern } from "src/api/supabase/rank";

const posterCss = style({
  width: percent(100),
});

interface Props {
  detail?: MovieDetails;
  videos: Array<Video>;
  isLoading?: boolean;
}

export const HeaderMovie = ({ detail, videos, isLoading }: Props) => {
  const { t } = useTranslation();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [open, setOpen] = useState(false);
  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  const trailers = videos.filter((video) => video.type === "Trailer");

  const getRank = async () => {
    if (detail) {
      const { data } = await getRanksByIdExtern(
        detail.id,
        THEMETMDB,
        MediaType.movie
      );
      setRank(data as Rank);
      setIsLoadingRank(false);
    }
  };

  useEffect(() => {
    if (refresh) {
      setIsLoadingRank(true);
      getRank();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    setIsLoadingRank(true);
    getRank();
  }, [detail]);

  const rankMovie = () => {
    if (detail) {
      const item: ItemToRank = {
        id: detail.id,
        name: detail.title,
        description: detail.overview,
        image: `https://image.tmdb.org/t/p/original${detail.backdrop_path}`,
        type: MediaType.movie,
      };
      setItemToRank(item);
    }
  };

  const checkMovie = (isSee: boolean) => {
    if (detail) {
      const item: ItemToCheck = {
        id: detail.id,
        name: detail.title,
        description: detail.overview,
        image: `https://image.tmdb.org/t/p/original${detail.backdrop_path}`,
        type: MediaType.movie,
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
                  {detail.title}
                </Typography>
                <Typography variant="h2" component="span" color="secondary">
                  ({moment(detail.release_date).format("YYYY")})
                </Typography>
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
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {detail.genres.map((genre) => (
                    <Grid item key={genre.id}>
                      <Link
                        to={`${BASEURLMOVIE}/discover?page=1&type=${MediaType.movie}&withgenres=${genre.id}`}
                      >
                        <Chip
                          label={genre.name}
                          variant="filled"
                          sx={{ cursor: "pointer" }}
                        />
                      </Link>
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
                      <Tooltip title={t("commun.notseemovie")}>
                        <IconButton
                          aria-label="Check"
                          onClick={() => checkMovie(false)}
                        >
                          <VisibilityOffIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title={t("commun.seemovie")}>
                        <IconButton
                          aria-label="Check"
                          onClick={() => checkMovie(true)}
                        >
                          <VisibilityIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t("commun.rankmovie")}>
                      <IconButton aria-label="Rate" onClick={rankMovie}>
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
                  {toHoursAndMinutes(detail.runtime, FormatTime.netflix)}
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
