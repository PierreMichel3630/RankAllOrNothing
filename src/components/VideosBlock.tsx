import { Alert, Chip, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { getBreakpoint } from "src/utils/mediaQuery";
import { SeeMoreButton } from "./button/Button";
import { Video } from "src/models/tmdb/commun/Video";
import { VideoSkeleton } from "./commun/skeleton/Skeleton";

enum Filter {
  all = "all",
  trailer = "trailer",
}

interface Props {
  videos: Array<Video>;
  isLoading?: boolean;
}

export const VideosBlock = ({ videos, isLoading = false }: Props) => {
  const NUMBERLINESHOW = 1;
  const FILTERFALSE = {
    all: false,
    trailer: false,
  };

  const { t } = useTranslation();

  const [seeMore, setSeeMore] = useState(false);
  const [seeMoreNumber, setSeeMoreNumber] = useState(1);
  const [filter, setFilter] = useState({
    all: true,
    trailer: false,
  });

  const breakpoint = getBreakpoint();
  const cols = {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6,
  }[breakpoint];
  const itemPerLine = (12 / cols) * NUMBERLINESHOW;

  const filterVideos = (a: Video) => {
    let res = false;
    if (filter[Filter.all]) {
      res = true;
    } else if (filter[Filter.trailer]) {
      res = a.type === "Trailer";
    }
    return res;
  };

  const selectFilter = (value: Filter) => {
    setFilter({ ...FILTERFALSE, [value]: !filter[value] });
  };

  const videosFilter = videos.filter(filterVideos);

  const videosDisplay = videosFilter.slice(0, seeMoreNumber * itemPerLine);

  const onClickSeeMore = () => {
    const newSeeMoreNumber = seeMoreNumber + 1;
    const totalItemShow = itemPerLine * newSeeMoreNumber;
    setSeeMoreNumber(seeMore ? 1 : newSeeMoreNumber);
    setSeeMore(totalItemShow >= videosFilter.length);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs="auto">
            <Typography variant="h2">{t("commun.videos")}</Typography>
          </Grid>
          <Grid item>
            <Chip
              label={t("commun.all")}
              variant={filter.all ? "filled" : "outlined"}
              onClick={() => selectFilter(Filter.all)}
            />
          </Grid>
          <Grid item>
            <Chip
              label={t("commun.trailer")}
              variant={filter.trailer ? "filled" : "outlined"}
              onClick={() => selectFilter(Filter.trailer)}
            />
          </Grid>
        </Grid>
      </Grid>
      {isLoading ? (
        Array.from(new Array(itemPerLine)).map((_, index) => (
          <Grid key={index} item xs={12} sm={6}>
            <VideoSkeleton />
          </Grid>
        ))
      ) : videos.length > 0 ? (
        <>
          {videosDisplay.map((video) => (
            <Grid key={video.id} item xs={12} sm={6}>
              <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${video.key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            </Grid>
          ))}
          {videosFilter.length > cols * NUMBERLINESHOW && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SeeMoreButton seeMore={seeMore} onClick={onClickSeeMore} />
            </Grid>
          )}
        </>
      ) : (
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Alert severity="warning">{t("commun.noresultvideo")}</Alert>
        </Grid>
      )}
    </Grid>
  );
};
