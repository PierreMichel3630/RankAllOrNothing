import { Chip, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserContext } from "src/App";
import { getTvDetails, getTvSeason } from "src/api/tmdb/tv";
import { CardEpisode } from "../commun/Card";
import { SerieDetails } from "src/models/tmdb/tv/SerieDetails";
import { SeasonDetail } from "src/models/tmdb/tv/SeasonDetail";
import { sortByEpisodeNumber } from "src/utils/sort";
import { CardEpisodeSkeleton, ChipSkeleton } from "../commun/skeleton/Skeleton";

export const EpisodesBlock = () => {
  let { id } = useParams();
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [detail, setDetail] = useState<undefined | SerieDetails>(undefined);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonDetail, setSeasonDetail] = useState<undefined | SeasonDetail>(
    undefined
  );
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [isLoadingSeason, setIsLoadingSeason] = useState(true);

  useEffect(() => {
    setIsLoadingDetail(true);
    if (id) {
      getTvDetails(Number(id), language.iso).then((res) => {
        setDetail(res);
        setIsLoadingDetail(false);
      });
    }
  }, [id, language]);

  useEffect(() => {
    setIsLoadingSeason(true);
    if (id) {
      getTvSeason(Number(id), selectedSeason, language.iso).then((res) => {
        setSeasonDetail(res);
        setIsLoadingSeason(false);
      });
    }
  }, [selectedSeason, language]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs="auto">
            <Typography variant="h2">{t("commun.episodes")}</Typography>
          </Grid>
          {isLoadingDetail || detail === undefined
            ? Array.from(new Array(4)).map((_, index) => (
                <Grid item key={index}>
                  <ChipSkeleton />
                </Grid>
              ))
            : detail.seasons.map((season) => (
                <Grid item key={season.id}>
                  <Chip
                    sx={{
                      height: "auto",
                      "& .MuiChip-label": {
                        display: "block",
                        whiteSpace: "normal",
                      },
                    }}
                    label={season.name}
                    variant={
                      selectedSeason === season.season_number
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() => setSelectedSeason(season.season_number)}
                  />
                </Grid>
              ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {isLoadingSeason || seasonDetail === undefined
            ? Array.from(new Array(5)).map((_, index) => (
                <Grid key={index} item xs={12}>
                  <CardEpisodeSkeleton />
                </Grid>
              ))
            : seasonDetail.episodes.sort(sortByEpisodeNumber).map((episode) => (
                <Grid item key={episode.id} xs={12}>
                  <CardEpisode value={episode} />
                </Grid>
              ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
